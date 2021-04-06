/* Exit Trip, the Player
by Beni Yager, 2021
*/

/* Directions
    0 don't move
    1 Left
    2 Up
    3 Right
    4 Down
*/

var Player = function()
{
    var m_posX = 0;
    var m_posY = 0;
    var m_sight = 3;

    this.setPosition=function(posX, posY)
    {
        log("New player position: "+posX+" "+posY);
        m_posX=posX;
        m_posY=posY;
    }

    this.getPosition=function()
    {
        var pos={x:m_posX,y:m_posY};
        return pos;
    }

    this.move=function(direction, dungeon)
    {
        switch(direction)
        {
            case 0: break; // used to call showview.
            case 1: // left
                if(dungeon.isWalkable(m_posX-1, m_posY))
                    m_posX-=1;
                break;
            case 2: // up
                if(dungeon.isWalkable(m_posX, m_posY-1))
                    m_posY-=1;
                break;
            case 3: // right
                if(dungeon.isWalkable(m_posX+1, m_posY))
                    m_posX+=1;
                break;
            case 4: // down
                if(dungeon.isWalkable(m_posX, m_posY+1))
                    m_posY+=1;
                break;
            
        }
        _showview(dungeon);
    }

    var _showview=function(dungeon)
    {
        for(var x=-m_sight;x<=m_sight;x++)
        {
            for(var y=-m_sight;y<=m_sight;y++)
            {
                dungeon.setVisible(m_posX+x,m_posY+y);
            }
        }
    }
}