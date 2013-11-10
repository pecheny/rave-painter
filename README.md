rave-painter
============

RavePainter  – an actionscript class aimed to make polygonal shapes written in spark path notation. 
Main concept inspired by brush tool of Flash IDE. Flash IDE gives unique vector painting expirience due to speed and simplicity. Those features have been achieved by using bitmap tracing. So the RavePainter includes bitmap canvas and bitmap brush. After each mouse stroke RavePainter converts content of bitmap canvas to string of shape description. String can be rendered with PathRenderer class.
Some concepts of bitmap tracing was given from [potrace algorithm] (http://potrace.sourceforge.net). 
However RavePainter at current state much more simple. It can be treated as a prototype.
