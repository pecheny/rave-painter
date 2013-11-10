package {
    import flash.display.GraphicsPathCommand;
    import flash.display.Sprite;

    /**
     * Simple canvas implementation for renderind polygonal shapes by string given in spark path compatible notation
     *
     * @see spark.primitives.Path
     */
    public class PathRenderer extends Sprite {
        public static const CLOSE_PATH:int = 10;

        /**
         *  Draws shapes.
         * @param source - string defining shapes according to spark path notation
         *
         * @see spark.primitives.Path#data
         */

        public function renderPath(source:String, color:uint = 0) {
            var shapes:Vector.<Vector.<int>> = new Vector.<Vector.<int>>();
            var sources = source.split(/z|Z/);
            for each (var source in sources) {
                var letterRe:RegExp = /[a-zA-Z]/;
                var numRe:RegExp = /\d+/;
                var commands:Vector.<int> = new <int>[];
                var data:Vector.<Number> = new <Number>[];
                var parsedData:Array = source.split(/\s+/);
                for (var i:int = 0; i < parsedData.length; i++) {
                    var str:String = parsedData[i];
                    if (letterRe.test(str)) {
                        commands.push(getCommand(str))
                    } else if (numRe.test(str)) {
                        data.push(str);
                    }
                }
                graphics.beginFill(color);
                graphics.drawPath(commands, data);
                graphics.endFill();
            }
        }


        private static function getCommand(str:String):int {
            switch (str) {
                case "M":
                case "m":
                    return GraphicsPathCommand.MOVE_TO;
                case "L":
                case "l":
                    return GraphicsPathCommand.LINE_TO;
                case "H":
                case "h":
                    return GraphicsPathCommand.NO_OP;
                case "V":
                case "v":
                    return GraphicsPathCommand.NO_OP;
                case "Q":
                case "q":
                    return GraphicsPathCommand.CURVE_TO;
                case "C":
                case "c":
                    return GraphicsPathCommand.CUBIC_CURVE_TO;
                case "Z":
                case "z":
                    return CLOSE_PATH;
            }
            return null;
        }
    }
}
