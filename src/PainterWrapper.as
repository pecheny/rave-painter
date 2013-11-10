package {
    import flash.display.Sprite;
    import flash.display.StageScaleMode;
    import flash.text.TextField;

    [SWF(width="800", height="600", frameRate="60", backgroundColor="0")]
    public class PainterWrapper extends Sprite {
        private var painter:RavePainter;
        private var renderer:PathRenderer;

        public function PainterWrapper() {
            stage.scaleMode = StageScaleMode.NO_SCALE;

            painter = new RavePainter(200, 150);
            painter.scaleX = painter.scaleY = 4;
            painter.addEventListener(RecognizeCompleteEvent.RECOGNIZE_COMPLETE, recognizeCompleteHandler);
            addChild(painter);

            var label = new TextField();
            label.text = "Draw something...";
            label.mouseEnabled = false;
            addChild(label);

            renderer = new PathRenderer();
            renderer.scaleX = renderer.scaleY = 4;
            renderer.mouseChildren = false;
            renderer.mouseEnabled = false;
            addChild(renderer);
        }

        private function recognizeCompleteHandler(event:RecognizeCompleteEvent):void {
            renderer.renderPath(event.data);
        }
    }
}
