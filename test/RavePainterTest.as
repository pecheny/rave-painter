package {
    import org.flexunit.asserts.assertEquals;

    public class RavePainterTest {
        [Embed(source="pixels.png")]
        public static const pixClass:Class;
        private var painter:RavePainter = new RavePainter(28, 2);

        public function RavePainterTest() {
        }

        [Before]
        public function setUp():void {
            painter.bitmap = new pixClass();

        }

        [After]
        public function tearDown():void {

        }

        [Test]
        public function testGetTurn():void {
            var abcd:int;
            abcd = 1 << 3;
            assertEquals(painter.getTurn(abcd), RavePainter.TURN_LEFT);
            abcd = (1 << 3) + 1;
            assertEquals(painter.getTurn(abcd), RavePainter.TURN_RIGHT);
            abcd = (1 << 3) + (1 << 1) + 1;
            assertEquals(painter.getTurn(abcd), RavePainter.TURN_RIGHT);
            abcd = 1 << 2;
            assertEquals(painter.getTurn(abcd), RavePainter.TURN_RIGHT);
            abcd = (1 << 2) + (1 << 1);
            assertEquals(painter.getTurn(abcd), RavePainter.TURN_LEFT);
            abcd = (1 << 2) + (1 << 1) + 1;
            assertEquals(painter.getTurn(abcd), RavePainter.TURN_LEFT);

            abcd = (1 << 3) + (1 << 1);
            assertEquals(painter.getTurn(abcd), 0);
            abcd = (1 << 2) + 1;
            assertEquals(painter.getTurn(abcd), 0);
        }


        [Test]
        public function testGetABCD():void {

            assertEquals(painter.getABCD(0, -1, RavePainter.DIR_RIGHT), abcd2int(0, 1, 0, 0));
            assertEquals(painter.getABCD(2, -1, RavePainter.DIR_RIGHT), abcd2int(0, 1, 0, 1));
            assertEquals(painter.getABCD(0, 0, RavePainter.DIR_RIGHT), abcd2int(1, 0, 0, 0));
            assertEquals(painter.getABCD(2, 0, RavePainter.DIR_RIGHT), abcd2int(1, 0, 1, 0));

            assertEquals(painter.getABCD(8, 0, RavePainter.DIR_DOWN), abcd2int(1, 1, 0, 1));
            assertEquals(painter.getABCD(8, 0, RavePainter.DIR_LEFT), abcd2int(0, 1, 1, 1));
            assertEquals(painter.getABCD(8, 0, RavePainter.DIR_TOP), abcd2int(1, 0, 1, 1));


        }

        private function abcd2int(a:int, b:int, c:int, d:int):int {
            var out:int = 0;
            out += (a << 3);
            out += (b << 2);
            out += (c << 1);
            out += d;
            return out;
        }

        [Test]
        public function testLocal2globalDirection():void {
            assertEquals(painter.local2globalDirection(RavePainter.TURN_LEFT, RavePainter.DIR_DOWN), RavePainter.DIR_RIGHT);
            assertEquals(painter.local2globalDirection(RavePainter.TURN_LEFT, RavePainter.DIR_RIGHT), RavePainter.DIR_TOP);
            assertEquals(painter.local2globalDirection(RavePainter.TURN_LEFT, RavePainter.DIR_TOP), RavePainter.DIR_LEFT);
            assertEquals(painter.local2globalDirection(RavePainter.TURN_LEFT, RavePainter.DIR_LEFT), RavePainter.DIR_DOWN);

            assertEquals(painter.local2globalDirection(RavePainter.TURN_RIGHT, RavePainter.DIR_LEFT), RavePainter.DIR_TOP);
            assertEquals(painter.local2globalDirection(RavePainter.TURN_RIGHT, RavePainter.DIR_TOP), RavePainter.DIR_RIGHT);
            assertEquals(painter.local2globalDirection(RavePainter.TURN_RIGHT, RavePainter.DIR_RIGHT), RavePainter.DIR_DOWN);
            assertEquals(painter.local2globalDirection(RavePainter.TURN_RIGHT, RavePainter.DIR_DOWN), RavePainter.DIR_LEFT);

            assertEquals(painter.local2globalDirection(0, RavePainter.DIR_LEFT), RavePainter.DIR_LEFT);
            assertEquals(painter.local2globalDirection(0, RavePainter.DIR_TOP), RavePainter.DIR_TOP);
            assertEquals(painter.local2globalDirection(0, RavePainter.DIR_RIGHT), RavePainter.DIR_RIGHT);
            assertEquals(painter.local2globalDirection(0, RavePainter.DIR_DOWN), RavePainter.DIR_DOWN);
        }

        [Test]
        public function testGetB():void {
            var abcd = (1 << 2) + (1 << 1);
            assertEquals(painter.getB(abcd), true)
        }

        [Test]
        public function testGetC():void {
            var abcd = (1 << 2) + (1 << 1);
            assertEquals(painter.getC(abcd), true)
        }
    }
}
