/*
    Copyright 2008,2009
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
/**
 * Creates a new instance of Sector.
 * @class Sector stores all style and functional properties that are required
 * to draw a sector on a board.
 * @param {JXG.Board} board Reference to the board the sector is drawn on.
 * @param {JXG.Point} p1 Midpoint of the sector.
 * @param {JXG.Point} p2 Point defining the sectors radius
 * @param {JXG.Point} p3 This point defines the angle of the sectors section.
 * @param {Array} ids Unique identifiers for the derived objects (arc, endpoint of the arc, line from p1 to p2, line from p1 to the endpoint of the arc) . 
 * Must be Strings. If null or an empty string is given to any of these, an unique id will be generated.
 * @param {Array} names Names for the derived objects (arc, endpoint of the arc, line from p1 to p2, line from p1 to the endpoint of the arc) . 
 * Must be Strings. If null or an empty string is given to any of these, an unique id will be generated.
 * @param {String} id Unique identifier for this object.  If null or an empty string is given,
 * an unique id will be generated by Board
 * @param {String} name Not necessarily unique name, displayed on the board.  If null or an
 * empty string is given, an unique name will be generated.
 * @see JXG.Board#addSector
 * @constructor
 * @extends JXG.GeometryElement
 */

 /* Sector legt nur die benoetigten Unterelemente an und verwaltet diese als Kinder, wird nicht mehr direkt gezeichnet */
JXG.Sector = function (board, p1, p2, p3, ids, names, id, layer) {
    /* Call the constructor of GeometryElement */
    this.constructor();
    /**
     * Sets type of GeometryElement, value is OBJECT_TYPE_SECTOR.
     * @final
     * @type int
     */    
    this.type = JXG.OBJECT_TYPE_SECTOR;
    this.elementClass = JXG.OBJECT_CLASS_AREA;                

    this.init(board, id, '');
    /**
     * Set the display layer.
     */
    if (layer == null) layer = board.options.layer['sector'];
    this.layer = layer;
    
    if(!JXG.isArray(ids)) {
        ids = [null, null, null, null];
    }
    
    if(!JXG.isArray(names)) {
        names = [null, null, null, null];
    }

    /**
     * Midpoint of the sector.
     * @type JXG.Point
     */
    this.point1 = JXG.getReference(this.board, p1);

    /**
     * Point defining the sectors circle.
     * @type JXG.Point
     */    
    this.point2 = JXG.getReference(this.board, p2);
    
    /**
     * The point defining the angle of the sector.
     * @type JXG.Point
     */
    this.point3 = JXG.getReference(this.board, p3);

    /**
     * This is just for the hasPoint() method. Precision for highlighting.
     * @type int
     */    
    //this.r = this.board.options.precision.hasPoint;
  
    this.visProp['visible'] = true;

    var circle = {}; // um projectToCircle benutzen zu koennen
    circle.midpoint = this.point1;
    var radius = this.Radius();
    circle.Radius = function() {
        return radius;
    };
    //-----------------
    // deprecated:
    circle.getRadius = function() {
        return radius;
    };
    //-----------------
    var p4coords = this.board.algebra.projectPointToCircle(this.point3,circle);
    
    var p = new JXG.Point(board, [p4coords.usrCoords[1], p4coords.usrCoords[2]], ids[1], names[1], true);
    p.fixed = true;
    this.addChild(p);
    p.update = function() {
        var circle = {}; // um projectToCircle benutzen zu koennen
        circle.midpoint = JXG.getReference(this.board, p1);
        var radius = (Math.sqrt(Math.pow(JXG.getReference(this.board, p1).coords.usrCoords[1]-JXG.getReference(this.board, p2).coords.usrCoords[1],2) + Math.pow(JXG.getReference(this.board, p1).coords.usrCoords[2]-JXG.getReference(this.board, p2).coords.usrCoords[2],2)));

        circle.Radius = function() {
            return radius;
        };
        //-------------------
        // deprecated
        circle.getRadius = function() {
            return radius;
        };
        //-------------------
        p4coords = this.board.algebra.projectPointToCircle(JXG.getReference(this.board, p3),circle);
        this.coords = p4coords;
        this.board.renderer.updatePoint(this);
        
        // Label mitschieben
        if(this.label.content.visProp['visible']) {
            //this.label.setCoordinates(this.coords);
            //this.board.renderer.updateLabel(this.label);
            this.label.content.update();
        }
        
        //for(var Element in this.childElements) {
        //    this.childElements[Element].update();
        //}     
    };
   
    var l1 = new JXG.Line(board, p1, p2, ids[2], names[2]);
    var l2 = new JXG.Line(board, p1, p.id, ids[3], names[3]);
    l1.setStraight(false,false);
    l2.setStraight(false,false);
   
    var a = new JXG.Arc(board, p1, p2, p3, ids[0], names[0]);
    a.visProp['fillColor'] = this.board.options.sector.fillColor;
    a.visProp['highlightFillColor'] = this.board.options.sector.highlightFillColor;
    a.visProp['fillOpacity'] = this.board.options.sector.fillOpacity;
    a.visProp['highlightFillOpacity'] = this.board.options.sector.highlightFillOpacity;
    
    /**
     * Endpoint of the derived arc.
     * @type JXG.Point
     */
    this.point4 = p;
    
    /**
     * The derived lines. 
    * this.lines[0] is the line between the midpoint of the sector and the startpoint of the arc
    * this.lines[1] is the line between the midpoint of the sector and the endpoint of the arc
     * @type Array
     */    
    this.lines = [l1, l2];

    /**
     * The derived arc.
     * @type JXG.Arc
     */    
    this.arc = a;
    
    /* Register sector at board */
    this.id = this.board.addSector(this);
    
    /* Add sector as child to defining points */
    this.point1.addChild(this);
    this.point2.addChild(this);
    this.point3.addChild(this);
};   
JXG.Sector.prototype = new JXG.GeometryElement;

/**
 * Checks whether (x,y) is near the sector.
 * @param {int} x Coordinate in x direction, screen coordinates.
 * @param {int} y Coordinate in y direction, screen coordinates.
 * @return {bool} Always false, because the sectors interior shall not be highlighted
 */
JXG.Sector.prototype.hasPoint = function (x, y) { 
    return false; 
};

/**
 * Calculates the sectors radius.
 * @type float
 * @return The sectors radius
 */
JXG.Sector.prototype.Radius = function() {
    return(Math.sqrt(Math.pow(this.point1.coords.usrCoords[1]-this.point2.coords.usrCoords[1],2) + Math.pow(this.point1.coords.usrCoords[2]-this.point2.coords.usrCoords[2],2)));
};

/**
 *@deprecated
 */
JXG.Sector.prototype.getRadius = function() {
    return this.Radius();
};

/**
 * Uses the boards renderer to update the sector and all of its children.
 */
 JXG.Sector.prototype.updateRenderer = function () {
   /* nichts zu tun */
};

JXG.createSector = function(board, parentArr, atts) {
    var el;
    if (atts==null) {
        atts = {};
    }
    if (typeof atts['layer'] == 'undefined') {
        atts['layer'] = null;
    }
    // Alles 3 Punkte?
    if ( (JXG.isPoint(parentArr[0])) && (JXG.isPoint(parentArr[1])) && (JXG.isPoint(parentArr[2]))) {
        el = new JXG.Sector(board, parentArr[0], parentArr[1], parentArr[2], atts["ids"], atts["names"], atts['id'], atts['layer']);
    } // Ansonsten eine fette Exception um die Ohren hauen
    else
        throw new Error("JSXGraph: Can't create sector with parent types '" + (typeof parentArr[0]) + "' and '" + (typeof parentArr[1]) + "' and '" + (typeof parentArr[2]) + "'.");

    return el;
};

JXG.JSXGraph.registerElement('sector', JXG.createSector);

/**
 * Creates a new circumcircle sector through three defining points.
 * @param {JXG.Board} board The board the sector is put on.
 * @param {Array} parents Array of three points defining the circumcircle sector.
 * @param {Object} attributs Object containing properties for the element such as stroke-color and visibility. See @see JXG.GeometryElement#setProperty
 * @type JXG.Sector
 * @return Reference to the created arc object.
 */
 JXG.createCircumcircleSector = function(board, parents, attributes) {
    var el, mp, idmp, det;
    
    attributes = JXG.checkAttributes(attributes,{withLabel:false, layer:null});
    if(attributes['id'] != null) {
        idmp = attributes['id']+'_mp';
    }
    
    // Alles 3 Punkte?
    if ( (JXG.isPoint(parents[0])) && (JXG.isPoint(parents[1])) && (JXG.isPoint(parents[2]))) {
        mp = board.create('circumcirclemidpoint',[parents[0], parents[1], parents[2]], {id:idmp, withLabel:false, visible:false});
        det = (parents[0].coords.usrCoords[1]-parents[2].coords.usrCoords[1])*(parents[0].coords.usrCoords[2]-parents[1].coords.usrCoords[2]) -
              (parents[0].coords.usrCoords[2]-parents[2].coords.usrCoords[2])*(parents[0].coords.usrCoords[1]-parents[1].coords.usrCoords[1]);
        if(det < 0) {
            el = new JXG.Sector(board, mp, parents[0], parents[2], attributes['id'], attributes['name'],attributes['withLabel'],attributes['layer']);
        }
        else {
            el = new JXG.Sector(board, mp, parents[2], parents[0], attributes['id'], attributes['name'],attributes['withLabel'],attributes['layer']);         
        }
        
        el.arc.update = function() {
            var determinante;
            if(this.traced) {
                this.cloneToBackground(true);
            }
            determinante = (parents[0].coords.usrCoords[1]-parents[2].coords.usrCoords[1])*(parents[0].coords.usrCoords[2]-parents[1].coords.usrCoords[2]) -
                           (parents[0].coords.usrCoords[2]-parents[2].coords.usrCoords[2])*(parents[0].coords.usrCoords[1]-parents[1].coords.usrCoords[1]);
            if(determinante < 0) {
                this.point2 = parents[0];
                this.point3 = parents[2];
            }
            else {
                this.point2 = parents[2];
                this.point3 = parents[0];
            }    
        }
        el.point4.setProperty({visible:false});
    } // Ansonsten eine fette Exception um die Ohren hauen
    else
        throw new Error("JSXGraph: Can't create circumcircle sector with parent types '" + (typeof parents[0]) + "' and '" + (typeof parents[1]) + "' and '" + (typeof parents[2]) + "'.");

    return el;
};

JXG.JSXGraph.registerElement('circumcirclesector', JXG.createCircumcircleSector);
