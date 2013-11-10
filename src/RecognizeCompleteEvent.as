package {
    import flash.events.Event;

    public class RecognizeCompleteEvent extends  Event{
        public static const RECOGNIZE_COMPLETE:String = "recognizeComplete";
        public var data:String;
        public function RecognizeCompleteEvent(data:String) {
            super(RECOGNIZE_COMPLETE);
            this.data = data;
        }
    }
}
