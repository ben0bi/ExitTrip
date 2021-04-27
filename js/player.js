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

// the message
var g_message = "";
var g_image = "";
var setMessage=function(text, image="") {g_message=text;g_image=image;}
var getMessage=function() {return g_message;}
var getImage=function() {return g_image;}

var Player = function()
{
    var me=this;
    var m_posX = 0;
    var m_posY = 0;
    var m_sight = 2;
    var m_attack=2;
    var m_health = 15;
    var m_maxHealth = 15;
    var m_coins=0; // credits.
    var m_myfloornumber=0;
    this.setFloorNumber=function(value) {m_myfloornumber=value;}

    // show the shop window
    this.showShop=function() 
    {
	    var html="<div class='shopbutton topbutton' onclick='g_player.buy(1);'>"+_getPrice(1)+"$: MindView &#128065;</div>";
	    html+="<div class='shopbutton' onclick='g_player.buy(2);'>"+_getPrice(2)+"$: Attack</div>";
	    html+="<div class='shopbutton' onclick='g_player.buy(3);'>"+_getPrice(3)+"$: 1 permanent &hearts;<br />+ Full Health</div>";
	    $('#shopwindow').jdHTML(html);
	    log("Showshop");
	    $('#shopwindow').jdShow();
    }

    // get the price for an item
    var _getPrice=function(which)
    {
        var value=0;
        switch(which)
        {
            case 1: if(m_sight<5) value=(m_sight-1)*150;break;
            case 2: if(m_attack<10) value=m_attack*50;break;
            case 3: value=100;break;
            default: break;
        }
        return value;
    }

    // buy something for the player
    this.buy=function(which)
    {
        var price = _getPrice(which);
        if(m_coins>=price)
        {
            m_coins-=price;
            switch(which)
            {
                case 1: if(m_sight<5) m_sight+=1;break;
                case 2: if(m_attack < 10) m_attack+=1;break;
                case 3: m_maxHealth+=1;m_health=m_maxHealth;break;
                default:
                    break;
            }
        }
        $("#values").html(this.printValues());
    }
    
    this.loadCookies=function()
    {
        if(getCookie("et_playersight")!=null)
            m_sight=parseInt(getCookie("et_playersight"));
        if(getCookie("et_playerattack")!=null)
            m_attack=parseInt(getCookie("et_playerattack"));
        if(getCookie("et_playerhealth")!=null)
            m_health=parseInt(getCookie("et_playerhealth"));
        if(getCookie("et_playermaxhealth")!=null)
            m_maxHealth=parseInt(getCookie("et_playermaxhealth"));
        if(getCookie("et_playercoins")!=null)
            m_coins=parseInt(getCookie("et_playercoins"));
        // et_actualfloor will get read somewhere else.
    }

    this.saveCookies=function()
    {
        setCookie("et_playersight",m_sight.toString(),180);
        setCookie("et_playerattack", m_attack.toString(),180);
        setCookie("et_playerhealth", m_health.toString(),180);
        setCookie("et_playermaxhealth", m_maxHealth.toString(),180);
        setCookie("et_playercoins", m_coins.toString(),180);
        setCookie("et_actualfloor", m_myfloornumber.toString());
    }

    this.getATK=function() {return parseInt(Math.random()*m_attack)+1;}

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

    // add some health to our health
    this.addHealth=function(value)
    {
        m_health+=value;
        if(m_health>m_maxHealth)
            m_health=m_maxHealth;
        if(m_health<0)
            m_health=0;
    }

    this.getHealth=function() {return m_health;}

    // show some player values.
    this.printValues=function()
    {
        var html="";
        html+="&hearts; "+m_health+" / "+m_maxHealth+"<br />";
        html+="$ "+m_coins+"<br />";
        html+="F "+m_myfloornumber+"<br />";
        html+="<small>ATK "+m_attack+" &#128065; "+m_sight+"</small><br />";
        return html;
    }

    this.move=function(direction, dungeon)
    {
        setMessage("");
        var oldx=m_posX;
        var oldy=m_posY;
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

        // check if there is a monster.
        // they will attack you themselves
        // so you don't have to.
        var monsters = dungeon.getMonsters();
        for(var i=0;i<monsters.length;i++)
        {
            var monster=monsters[i];
            if(monster.posX==m_posX && monster.posY==m_posY)
            {
               // log("MONSTERPOSITION");
                m_posX=oldx;
                m_posY=oldy;
            }
        }

        // NPC turn.
        dungeon.moveMonsters(me);

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
                        case "health":
                            setMessage("You pick up some root beer.<br />Heals "+item.amount+" HP", item.image);
                            me.addHealth(item.amount);
                            break;
                        case "coin":
                            setMessage("You pick up "+item.amount+" CryptoBenis.", item.image);
                            m_coins+=item.amount;
                            break;
                        default:
                            setMessage("You pick up an unidentified item.");
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
        if(mt=='v') // go back down.
        {
            if(dungeon.previousDungeon!=null)
            {
                setMessage("You go one chapter downwards.", "data/img/downstairs.jpg");
                dungeon = dungeon.previousDungeon;
            }
        }

        if(mt=='^') // UPwards = downwards in normal roguelikes.
        {
            setMessage("You go one chapter upwards.", "data/img/upstairs.jpg");
            if(dungeon.nextDungeon==null)
            {
                log("> Generating new floor.")
                var rooms = dungeon.getRoomProps();
                var lastroom = rooms[rooms.length-1];
                var props = {
                    floornumber: dungeon.getFloorNumber()+1,
                    initialx: lastroom.posX,
                    initialy: lastroom.posY,
                    initialwidth: lastroom.width,
                    initialheight: lastroom.height,
			    	roomcount: 15,
				    mapsizex: 100,
    				mapsizey: 40,
	    			minroomx: 3,
		    		minroomy: 3,
			    	maxroomx: 10,
				    maxroomy: 10
                }
                var olddungeon = dungeon;

                dungeon = new DungeonGenerator();
                dungeon.previousDungeon=olddungeon;
                olddungeon.nextDungeon=dungeon;

                dungeon.setProperties(props);
                dungeon.generate();
                dungeon.setMap(m_posX, m_posY, 'v');
            }else{
                log("> Using already created floor.");
                dungeon = dungeon.nextDungeon;
            }
        }

        // finally save the player stats to cookies.
        // on reload, a new floor is created but the
        // old player stats will be loaded.
        m_myfloornumber=dungeon.getFloorNumber();
        this.saveCookies();

        _showview(dungeon);
        return dungeon;
    }

    // set tiles visible around the player.
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