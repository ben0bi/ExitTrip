/* Exit Trip, the Player
by Beni Yager, 2021
*/

/* Directions
    1 Left
    2 Up
    3 Right
    4 Down
*/

var Player = function()
{
    var m_posX = 0;
    var m_posY = 0;
 
    this.setPosition=function(posX, posY)
    {
        log("New player position: "+posX+" "+posY);
        m_posX=posX;
        m_posY=posY;
    }

    this.move=function(direction, dungeon)
    {
        switch(direction)
        {
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
    }
}