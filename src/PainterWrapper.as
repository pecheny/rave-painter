/**
 * Created with IntelliJ IDEA.
 * User: shoo
 * Date: 1/2/13
 * Time: 6:52 PM
 * To change this template use File | Settings | File Templates.
 */
package {
	import flash.display.Sprite;
	import flash.events.MouseEvent;
[SWF(width="800", height="600", frameRate="220")]
	public class PainterWrapper extends Sprite{
		private var painter:RasterPainter;
		public function PainterWrapper() {
			painter = new RasterPainter(200,150);
			painter.scaleX = painter.scaleY = 4;
			addChild(painter);
			stage.addEventListener(MouseEvent.MOUSE_DOWN, mouseDownHandler);
			stage.addEventListener(MouseEvent.MOUSE_UP, mouseUpHandler);

		}

		private function mouseDownHandler(event:MouseEvent):void {
			painter.startDraw();
		}

		private function mouseUpHandler(event:MouseEvent):void {
			painter.stopDraw();
		}
	}
}
