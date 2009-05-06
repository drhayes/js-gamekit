// requires jQuery

// define a point object that knows how to add itself, basic {'x': 0, 'y': 0} object
// only validates that params are numbers, not their values
// also has finer pipX and pipY values
var point = function(nx, ny, npipX, npipY) {
    if (typeof(nx) !== 'number' || isNaN(nx)) {
        throw(new Error('x should be number'));
    }
    if (typeof(ny) !== 'number' || isNaN(ny)) {
        throw(new Error('y should be number'));
    }

    npipX = npipX || 0;
    npipY = npipY || 0;
    
    this.x = nx;
    this.y = ny;
    this.pipX = npipX;
    this.pipY = npipY;
    
    // correct for big pip values
    if (this.pipX >= point.MAX_PIP) {
        this.x += Math.floor(this.pipX / point.MAX_PIP);
        this.pipX = this.pipX % point.MAX_PIP;
    }
    if (this.pipX <= -point.MAX_PIP) {
        this.x -= Math.ceil(Math.abs(this.pipX) / point.MAX_PIP);
        this.pipX = -(Math.abs(this.pipX) % point.MAX_PIP);
    }
    if (this.pipY >= point.MAX_PIP) {
        this.y += Math.floor(this.pipY / point.MAX_PIP);
        this.pipY = this.pipY % point.MAX_PIP;
    }
    if (this.pipY <= -point.MAX_PIP) {
        this.y -= Math.ceil(Math.abs(this.pipY) / point.MAX_PIP);
        this.pipY = -(Math.abs(this.pipY) % point.MAX_PIP);
    }

    this.getHash = function() {
        return this.x + '_' + this.y;
    }
    
    this.toString = function() {
        return '(' + this.x + ', ' + this.y + ', ' + this.pipX + ', ' + this.pipY + ')';
    }
}

point.MAX_PIP = 16;

// add two points together to produce a new point that is the sum
// of their respective values
point.add = function(pt1, pt2) {
    var xVal1 = (pt1.x * point.MAX_PIP) + pt1.pipX;
    var yVal1 = (pt1.y * point.MAX_PIP) + pt1.pipY;
    var xVal2 = (pt2.x * point.MAX_PIP) + pt2.pipX;
    var yVal2 = (pt2.y * point.MAX_PIP) + pt2.pipY;
    
    return new point(0, 0, xVal1 + xVal2, yVal1 + yVal2);
}

// convert a point hash from "x_y" to a point object (x,y)
point.fromHash = function(hashStr) {
    if (typeof(hashStr) === 'undefined' || hashStr === null) {
        throw new Error('hashStr cannot be null');
    }
    var ptValues = hashStr.split('_');
    if (ptValues.length !== 2) {
        throw new Error('malformed hash string');
    }
    return new point(Number(ptValues[0]), Number(ptValues[1]));
}

// given a point with pip values > 0, round up to nearest point
point.round = function(pt) {
    var xDelta = 0;
    var yDelta = 0;
    if (pt.pipX > 0) {
        xDelta = 1;
    }
    else if (pt.pipX < 0) {
        xDelta = -1;
    }
    if (pt.pipY > 0) {
        yDelta = 1;
    }
    else if (pt.pipY < 0) {
        yDelta = -1;
    }
    var deltaPt = new point(xDelta, yDelta);
    return new point(pt.x + xDelta, pt.y + yDelta);
}

point.equals = function(pt1, pt2) {
    return (pt1.x === pt2.x && pt1.y === pt2.y && pt1.pipX === pt2.pipX && pt1.pipY === pt2.pipY);
}
