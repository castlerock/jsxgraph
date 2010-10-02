/*
    Copyright 2010
        Matthias Ehmann,
        Michael Gerhaeuser,
        Carsten Miller,
        Bianca Valentin,
        Alfred Wassermann,
        Peter Wilfahrt

    This file is part of JSXGraph.

    JSXGraph is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    JSXGraph is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with JSXGraph.  If not, see <http://www.gnu.org/licenses/>.
*/

JXG.Math.Numerics.createRoulette = function(c1, c2, start_c1, stepsize, time, pointlist) {
    var alpha = 0,
        t1 = start_c1,
        t2 = JXG.Math.Numerics.root(
                function(t) { 
                    var c1x = c1.X(t1),
                        c1y = c1.Y(t1),
                        c2x = c2.X(t),
                        c2y = c2.Y(t);
                    return (c1x-c2x)*(c1x-c2x) + (c1y-c2y)*(c1y-c2y);
                },
                0),
        t1_new = 0.0, t2_new = 0.0, 
        rotation = brd.create('transform',[function(){ return alpha;}, 
                                           function(){ return c1.X(t1);},
                                           function(){ return c1.Y(t1);}], 
                                          {type:'rotate'}),
        linDist = function(t) {
                var mx = c1.X(t1),
                    my = c1.Y(t1),
                    c1x = mx - c1.X(t1_new),
                    c1y = my - c1.Y(t1_new),
                    c2x = mx - c2.X(t),
                    c2y = my - c2.Y(t);
                return (c1x*c1x+c1y*c1y) - (c2x*c2x+c2y*c2y);
            },   
        interval = null; 

    this.rolling = function(){
        t1_new = t1+stepsize;
        t2_new = JXG.Math.Numerics.root(linDist, t2+stepsize);
        alpha = -JXG.Math.Geometry.rad(
                    [c1.X(t1_new),c1.Y(t1_new)],
                    [c1.X(t1),c1.Y(t1)],
                    [c2.X(t2_new),c2.Y(t2_new)]);
        rotation.applyOnce(pointlist);
        brd.update();
        t1 = t1_new;
        t2 = t2_new;
    };
    
    this.start = function() {
        if (time>0) {
            interval = setInterval(this.rolling, time);
        }
        return this;
    };
    
    this.stop = function() {
        clearInterval(interval);
        return this;
    };
    return this;
};
