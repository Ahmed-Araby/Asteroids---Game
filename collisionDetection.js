class point
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
    
    minus(p)
    {
        // caller point is the end point in the edge 
        // return the vector 
        return new point(this.x - p.x, this.y - p.y);
    }
}

class edge
{
    constructor(p1, p2)
    {
        this.startP = p1;
        this.endP = p2;
    }
}

class polygon
{
    constructor(edges)
    {
        this.edges = edges;
    }
    
    size()
    {
        return this.edges.length;
    }
}

class collisionDetection
{
    constructor()
    { 
    }
    
    SATAlgo(polygon1, polygon2)
    {
        /*
        the algo will take 2 convex polygons
        and apply the seprated axis theorem to detect if they overlap 
        or not.
        
        polygon is a set of edges each geometric shape class 
        will have a function that will covnert the shape into 
        set of edges
        
        does edges have to be in clock wise direction in both 
        polygons !!?????
        */
        
        for(var e=0; e<polygon1.size(); e++){
            // loop throw the edges 
            
            var edg = polygon1.edges[e];
            var vec = edg.endP.minus(edg.startP);
            var prepd = new point(-vec.y, vec.x);
            
            // get the projections
            // from the first polygon
            var minp1 = 100000, maxp1 = -1000000;
            for(var i =0; i<polygon1.size(); i++){
                var edg = polygon1.edges[i];
                var endP = edg.endP;
                
                // project the point into 
                // the prependicular vector 
                var projScaler = this.dot_product(prepd, endP);
                minp1 = Math.min(minp1, projScaler);
                maxp1 = Math.max(maxp1, projScaler);
            }
            
            // get the projections
            // from the second polygon 
            var minp2 = 100000, maxp2 = -100000;
            for(var i=0; i<polygon2.size(); i++){
                var edg = polygon2.edges[i];
                var endP = edg.endP;
                
                // project the point into
                // the prependicular vector 
                var projScaler = this.dot_product(prepd, endP);
                minp2 = Math.min(minp2, projScaler);
                maxp2 = Math.max(maxp2, projScaler);
            }
        
            if(!(minp2 >= minp1 && minp2 <= maxp1) &&
              !( minp1 >= minp2 && minp1 <=maxp2))
                return false; // no overlap and prepd is the seprate axis 
        }
        
        return true; // overlap 
    }
    
    detect_collision(polygon1, polygon2, algoName)
    {
        var res1 , res2;
        if(algoName == 'SAT'){
            res1 = this.SATAlgo(polygon1,polygon2);
            if(res1==false) // we have seprate axis no need for more computation.
                res2 = false;
            else 
                res2 = this.SATAlgo(polygon2, polygon1)
        }
        else{
            console.log("not supported algorithm");
        }
        return (res1 && res2);
    }
    
    dot_product(vec1, vec2)
    {
        return vec1.x * vec2.x + vec1.y * vec2.y;
    }
}