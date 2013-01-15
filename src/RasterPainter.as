package {
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.geom.ColorTransform;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.utils.setTimeout;

	public class RasterPainter extends Sprite {
		public static const DIR_TOP:int = 1;
		public static const DIR_RIGHT:int = 1 << 1;
		public static const DIR_DOWN:int = 1 << 2;
		public static const DIR_LEFT:int = 1 << 3;
		private var _bitmap:Bitmap;
		private var brush:Bitmap;
		public static const destinationPoint:Point = new Point();
		public static const currentPoint:Point = new Point();
		public static const lastPoint:Point = new Point();
		private var canvas:Sprite;

		public function RasterPainter(width:int, height:int) {
			super();
			_bitmap = new Bitmap(new BitmapData(width, height, false, 0xffffff));
			addChild(_bitmap);
			brush = new Bitmap(new BitmapData(3, 3, false, 0));

			canvas = new Sprite();
			addChild(canvas);
		}

		public function startDraw():void {

			lastPoint.x = bitmap.mouseX - brush.width/2;
			lastPoint.y = bitmap.mouseY - brush.height/2;
			_bitmap.bitmapData.copyPixels(brush.bitmapData, brush.getBounds(brush), lastPoint, null, null, true);
			addEventListener(MouseEvent.MOUSE_MOVE, drawingHandler);
		}

		public function stopDraw():void {
			removeEventListener(MouseEvent.MOUSE_MOVE, drawingHandler);
			findPath();
		}

		private function drawingHandler(e:Event):void {
			var spacing:Number = 2;
			destinationPoint.x = bitmap.mouseX - brush.width/2;
			destinationPoint.y = bitmap.mouseY - brush.height/2;
			if (destinationPoint.x <= bitmap.width && destinationPoint.y < bitmap.height) {
				var distance:Number = destinationPoint.subtract(lastPoint).length;
				var shotNumber:Number = distance/spacing;
				var xStep:Number = (destinationPoint.x - lastPoint.x)/shotNumber;
				var yStep:Number = (destinationPoint.y - lastPoint.y)/shotNumber;
				for (var i:int = 0; i < shotNumber; i++) {
					currentPoint.x = lastPoint.x + i*xStep;
					currentPoint.y = lastPoint.y + i*yStep;
					_bitmap.bitmapData.copyPixels(brush.bitmapData, brush.getBounds(brush), currentPoint, null, null, true);
				}
				lastPoint.copyFrom(destinationPoint);
			}
		}


		public function get bitmap():Bitmap {
			return _bitmap;
		}

		private var lastVertex:DirectedVertex;
		private var firstVertex:DirectedVertex;
		private var counter:int;
		private var pathHeads:Vector.<DirectedVertex> = new Vector.<DirectedVertex>();

		private function findPath():void {
			var colorBoundsRect:Rectangle = bitmap.bitmapData.getColorBoundsRect(0xFFFFFFFF, 0xFF000000);
			trace("rect", colorBoundsRect);
			if (colorBoundsRect.width == 0 && colorBoundsRect.height == 0) {
				drawPathes();
				return;
			}
			var y:Number = colorBoundsRect.top;
			var x:Number = colorBoundsRect.left;
			while (isPixelBlack(x, y) == 0) {
				y++;
			}
			firstVertex = new DirectedVertex(x, y);
			currentPoint.x = x;
			currentPoint.y = y;
			lastVertex = firstVertex;
			canvas.graphics.moveTo(x, y);
			step(x, y - 1, DIR_RIGHT);
		}

		private function drawPathes():void {
			for each (var head:DirectedVertex in pathHeads) {
				var x:int = head.x + 1;
				var y:int = head.y;
				canvas.graphics.moveTo(x, y);
				canvas.graphics.beginFill(0xffffff*Math.random());
				var vertex:DirectedVertex = head.next;
				while (vertex.next != null) {
					//					x += vertex.x;
					//					y += vertex.y;
					canvas.graphics.lineTo(vertex.x + 1, vertex.y);
					vertex = vertex.next;
				}
				canvas.graphics.endFill();
			}
			canvas.graphics.lineStyle(1, 0x909090);
			canvas.graphics.moveTo(pathHeads[0].x, pathHeads[0].y);
			drawStrightSegment(pathHeads[0].next);
		}

		private function drawStrightSegment(nextFurther:DirectedVertex):void {
			var further:DirectedVertex = findFurtherVertexOnSegment(nextFurther);
			if (further) {
				canvas.graphics.lineTo(nextFurther.x, nextFurther.y);
				setTimeout(drawStrightSegment, 100, further);
			}
		}

		private function step(x0:int, y0:int, direction:int):void {
			counter++;
			var ABCD:int = getABCD(x0, y0, direction);
			var turn:int = getTurn(ABCD);
			var outDir:int = local2globalDirection(turn, direction);
			lastVertex = lastVertex.followTo(outDir);
			//			currentPoint.x += lastVertex.x;
			//			currentPoint.y += lastVertex.y;
			if ((lastVertex.x == firstVertex.x && lastVertex.y == firstVertex.y)) {
				finishPath();
				return;
			}
			step(lastVertex.x, lastVertex.y - 1, lastVertex.getDirection());
		}

		private function finishPath():void {
			var x:int = firstVertex.x + 1;
			var y:int = firstVertex.y;
			trace("bgn", x, y);
			canvas.graphics.moveTo(x, y);
			canvas.graphics.beginBitmapFill(bitmap.bitmapData);
			var vertex:DirectedVertex = firstVertex.next;
			while (vertex.next != null) {
				//				x += vertex.x;
				//				y += vertex.y;
				canvas.graphics.lineTo(vertex.x + 1, vertex.y);
				vertex = vertex.next;
			}
			canvas.graphics.endFill();
			var sourceBD:BitmapData = new BitmapData(bitmap.bitmapData.width, bitmap.bitmapData.height, true, 0);
			sourceBD.draw(canvas);
			var invertTransform:ColorTransform = new ColorTransform(-1, -1, -1, 1, 255, 255, 255, 0);
			sourceBD.colorTransform(sourceBD.rect, invertTransform);
			bitmap.bitmapData.draw(sourceBD);
			canvas.graphics.clear();
			pathHeads.push(firstVertex);
			setTimeout(findPath, 150);
		}

		private function findFurtherVertexOnSegment(vertex:DirectedVertex):DirectedVertex {
			var currentFurther:DirectedVertex = vertex.next;
			var constr1:Point = new Point();
			var constr2:Point = new Point();
			var off:Point = new Point();

			while (currentFurther.next) {

				// check directions

				// check xprod for constr 1
				// check xprod for constr 2

				if (compareDirections(constr1, currentFurther) > 0 || compareDirections(constr2, currentFurther) < 0) {
					break;
				}


				// update constrs

				if (!(Math.abs(currentFurther.x) <= 1 && Math.abs(currentFurther.y) <= 1)) {
					off.x = currentFurther.x + ((-currentFurther.y >= 0 && (-currentFurther.y > 0 || currentFurther.x < 0)) ? 1 : -1);
					off.y = currentFurther.y + ((-currentFurther.x <= 0 && (-currentFurther.x < 0 || currentFurther.y < 0)) ? 1 : -1);
					if (compareDirections(constr1, off) <= 0) {
						constr1.x = off.x;
						constr1.y = off.y;
					}

					off.x = currentFurther.x + ((-currentFurther.y <= 0 && (-currentFurther.y < 0 || currentFurther.x < 0)) ? 1 : -1);
					off.y = currentFurther.y + ((-currentFurther.x >= 0 && (-currentFurther.x > 0 || currentFurther.y < 0)) ? 1 : -1);
					if (compareDirections(constr2, off) >= 0) {
						constr2.x = off.x;
						constr2.y = off.y;
					}
				}

				// go to next vertex
				currentFurther = currentFurther.next
			}
			return currentFurther;
		}

		private function compareDirections(a:Object, b:Object):Number {
			return a.x*b.y - a.y*b.x;
		}

		public function getABCD(x0:int, y0:int, direction:int):int {
			switch (direction) {
				case DIR_DOWN :
					return getBottomABCD(x0, y0);
				case DIR_LEFT:
					return getLeftABCD(x0, y0);
				case DIR_RIGHT:
					return getRightABCD(x0, y0);
				case DIR_TOP:
					return getTopABCD(x0, y0);
			}
			return 0;
		}

		public static const TURN_RIGHT:int = 1;
		public static const TURN_LEFT:int = 2;

		public function local2globalDirection(localTurn:int, inputDirection:int):int {
			var outDir:int;
			switch (localTurn) {
				case TURN_RIGHT:
					outDir = inputDirection << 1;
					break;
				case TURN_LEFT:
					outDir = inputDirection >> 1;
					break;
				case 0:
					outDir = inputDirection;
					break;
			}
			if (outDir == 0) outDir = DIR_LEFT;
			if (outDir > DIR_LEFT) outDir = DIR_TOP;
			return outDir;
		}

		//---


		public function getTurn(abcd:int):int {
			if (abcd >> 3 & abcd >> 2) throw new Error("Blocked direction");
			// 0 - fw, 1 - rt, 2 - lt;
			var rotation:int;
			if (( getC(abcd) && getB(abcd))) rotation = TURN_LEFT;
			if (( getA(abcd) && getD(abcd))) rotation = 1;
			if (!getD(abcd) && !getC(abcd)) {
				rotation = getA(abcd) ? 2 : 1;
			}
			return rotation;
		}

		private function getA(abcd:int):Boolean {
			return (abcd >> 3) == 1;
		}

		public function getB(abcd:int):Boolean {
			return (abcd >> 2) - ((abcd >> 3) << 1) == 1;
		}

		public function getC(abcd:int):Boolean {
			return (abcd >> 1) - ((abcd >> 2) << 1) == 1;
		}

		private function getD(abcd:int):Boolean {
			return abcd - ((abcd >> 1) << 1) == 1;
		}

		/**
		 *  Returns bits mask  according to black pixels of square in the following order
		 *  | a | c |
		 *  | b | d |
		 * @param x0 x of left top corner of the square .
		 * @param y0 y of left top corner of the square.
		 * @return int last four bits of which represent black pixels (1 if pixel is black and 0 otherwise).
		 */
		private function getRightABCD(x0:int, y0:int):int {
			return   (isPixelBlack(x0, y0) << 3) + (isPixelBlack(x0, y0 + 1) << 2) + (isPixelBlack(x0 + 1, y0) << 1) + (isPixelBlack(x0 + 1, y0 + 1));
		}

		/**
		 *  Returns bits mask  according to black pixels of square in the following order
		 *  | d | b |
		 *  | c | a |
		 * @param x0 x of left top corner of the square .
		 * @param y0 y of left top corner of the square.
		 * @return int last four bits of which represent black pixels (1 if pixel is black and 0 otherwise).
		 */
		private function getLeftABCD(x0:int, y0:int):int {
			return   (isPixelBlack(x0 + 1, y0 + 1) << 3) + (isPixelBlack(x0 + 1, y0) << 2) + (isPixelBlack(x0, y0 + 1) << 1) + isPixelBlack(x0, y0);
		}

		/**
		 *  Returns bits mask  according to black pixels of square in the following order
		 *  | c | d |
		 *  | a | b |
		 * @param x0 x of left top corner of the square .
		 * @param y0 y of left top corner of the square.
		 * @return int last four bits of which represent black pixels (1 if pixel is black and 0 otherwise).
		 */
		private function getTopABCD(x0:int, y0:int):int {
			return   (isPixelBlack(x0, y0 + 1) << 3) + (isPixelBlack(x0 + 1, y0 + 1) << 2 ) + (isPixelBlack(x0, y0) << 1) + isPixelBlack(x0 + 1, y0);
		}

		/**
		 *  Returns bits mask  according to black pixels of square in the following order
		 *  | b | a |
		 *  | d | c |
		 * @param x0 x of left top corner of the square .
		 * @param y0 y of left top corner of the square.
		 * @return int last four bits of which represent black pixels (1 if pixel is black and 0 otherwise).
		 */
		private function getBottomABCD(x0:int, y0:int):int {
			return  ( isPixelBlack(x0 + 1, y0) << 3) + ( isPixelBlack(x0, y0) << 2) + (isPixelBlack(x0 + 1, y0 + 1) << 1) + (isPixelBlack(x0, y0 + 1));
		}

		private function isPixelBlack(x:int, y:int):int {
			if (x < 0 || x > bitmap.width || y < 0 || y > bitmap.height) return 0;
			//			trace(bitmap.bitmapData.getPixel(x, y)) ;
			return bitmap.bitmapData.getPixel(x, y) < 1 ? 1 : 0;
		}

		public function set bitmap(value:Bitmap):void {
			_bitmap = value;
		}
	}
}


class DirectedVertex {
	public var x:int;
	public var y:int;
	public var next:DirectedVertex;
	private var _direction:int;

	public function DirectedVertex(x:int, y:int):void {
		this.x = x;
		this.y = y;
	}

	public function followTo(direction:int):DirectedVertex {
		switch (direction) {
			case RasterPainter.DIR_RIGHT:
				return toRight();
			case RasterPainter.DIR_LEFT:
				return toLeft();
			case  RasterPainter.DIR_TOP:
				return toTop();
			case RasterPainter.DIR_DOWN:
				return toBottom();
		}
		return null;
	}

	public function toRight():DirectedVertex {
		var directedVertex:DirectedVertex = new DirectedVertex(x + 1, y);
		directedVertex._direction = RasterPainter.DIR_RIGHT;
		next = directedVertex;
		return directedVertex;
	}

	public function toLeft():DirectedVertex {
		var directedVertex:DirectedVertex = new DirectedVertex(x - 1, y);
		directedVertex._direction = RasterPainter.DIR_LEFT;
		next = directedVertex;
		return directedVertex;
	}

	public function toTop():DirectedVertex {
		var directedVertex:DirectedVertex = new DirectedVertex(x, y - 1);
		directedVertex._direction = RasterPainter.DIR_TOP;
		next = directedVertex;
		return directedVertex;
	}

	public function toBottom():DirectedVertex {
		var directedVertex:DirectedVertex = new DirectedVertex(x, y + 1);
		directedVertex._direction = RasterPainter.DIR_DOWN;
		next = directedVertex;
		return directedVertex;
	}

	public function getDirection():int {
		return _direction;
		//		if (x == 1 && y == 0) return RasterPainter.DIR_RIGHT;
		//		if (x == -1 && y == 0) return RasterPainter.DIR_LEFT;
		//		if (x == 0 && y == -1) return RasterPainter.DIR_TOP;
		//		if (x == 0 && y == 1) return RasterPainter.DIR_DOWN;
		//		return NaN;
	}
}