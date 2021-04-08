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
    var m_sight = 2;
    var m_health = 15;
    var m_maxHealth = 15;
    var m_coins=0; // credits.

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

    // show some player values.
    this.printValues=function()
    {
        var html="";
        html+="&#9829; "+m_health+" / "+m_maxHealth+"<br />";
        html+="&#8353; "+m_coins+"<br />";
        html+="<small>&#128065; "+m_sight+"</small><br />";
        return html;
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

        // check if the player can pick up some items.
        if(dungeon.checkForItem(m_posX,m_posY)==true)
        {
            var items=dungeon.getItems();
            var newitems=Array();
            for(var it=0;it<items.length;it++)
            {
                var item=items[it];
                if(item.posX==m_posX && item.posY==m_posY)
                {
                    // what item is it?
                    switch(item.type)
                    {
                        case "coin":
                            log("YOU PICK UP "+item.amount+" COINS.")
                            m_coins+=item.amount;
                            break;
                        default:
                            break;
                    }
                }else{
                    newitems.push(item);
                }
            }
            dungeon.setItems(newitems);
        }

        // check if a new dungeon has to be created.
        var mt=dungeon.getMap(m_posX, m_posY);
        if(mt=='^')
        {
            var rooms = dungeon.getRoomProps();
            var lastroom = rooms[rooms.length-1];
            log("GOING UPWARDS at:" +lastroom.posX+" "+lastroom.posY+" "+lastroom.width+" "+lastroom.height);
            var props = {
                initialx: lastroom.posX,
                initialy: lastroom.posY,
                initialwidth: lastroom.width,
                initialheight: lastroom.height
            }
            dungeon.setProperties(props);
            dungeon.generate();
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