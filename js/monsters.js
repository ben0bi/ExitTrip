// a dungeon monster
var DungeonMonster = function()
{
	var me=this;
    this.level=0;
	this.health=5;
	this.mapchar="M";
	this.maxhealth=5;
	this.attack=1;
	this.posX=0;
	this.posY=0;
	this.type="MieserKadser";
	this.image="data/img/MieserKadser.jpg";

    this.copyNew = function(monster)
    {
        me.level = monster.level;
        me.health= monster.maxhealth;
        me.maxhealth=monster.maxhealth;
        me.mapchar=monster.mapchar;
        me.attack=monster.attack;
        me.type=monster.type;
        me.image=monster.image;
        // must set position from outside.
    }

    this.addHealth=function(value)
	{
		me.health+=value;
		if(me.health<0)
			me.health=0;
		if(me.health>me.maxhealth)
			me.health=me.maxhealth;
	}

    // move the monster
	this.move=function(dungeon, player)
	{
/*		var path=AStar(me.posX, me.posY, player.getPosition().x, player.getPosition().y, dungeon);
		if(path.lenght>1)
		{
			me.posX=path[1].posX;
			me.posY=path[1].posY;
		}
		*/
		// very simple move algorithmus.
		var moved = false;
		// maybe move away from the player (by setting old x).
		var oldx=me.posX;
		var oldy=me.posY;

		moved=false;
		// move towards the player.
		if(player.getPosition().y>me.posY && dungeon.isWalkable(me.posX, me.posY+1) && dungeon.hasMonster(me.posX, me.posY+1)==false)
		{
			me.posY+=1;
			moved = true;
		}
		if(moved==false && player.getPosition().y<me.posY && dungeon.isWalkable(me.posX, me.posY-1)  && dungeon.hasMonster(me.posX, me.posY-1)==false)
		{
			me.posY-=1;
			moved = true;
		}
		if(moved==false && player.getPosition().x<me.posX && dungeon.isWalkable(me.posX-1, me.posY) && dungeon.hasMonster(me.posX-1, me.posY)==false)
		{
			me.posX-=1;
			moved = true;
		}
		if(moved==false && player.getPosition().x>me.posX && dungeon.isWalkable(me.posX+1, me.posY) && dungeon.hasMonster(me.posX+1, this.posY)==false)
		{
			me.posX+=1;
		}

		// check if position is player position.
		// if it was before, it will now occupy the newly calculated oldx, oldy.
		if(me.posX==player.getPosition().x && me.posY==player.getPosition().y)
		{
			me.fight(player);
			if(player.getHealth()>0)
			{
				me.posX=oldx;
				me.posY=oldy;
			}
		}
	}

	// fight a player
	// player proofs for death himself.
	// TODO: Roleplay-like fighting system.
	this.fight=function(player)
	{
		var atk=parseInt(Math.random(me.attack))+1;
		player.addHealth(-atk);
		var patk=player.getATK();
		me.addHealth(-patk);
		var msg=me.type+" attacks: -"+atk+" HP<br />You attack: -"+patk+" HP<br />";
		if(me.health<=0)
			msg+=me.type+" has died.";
		setMessage(msg, me.image);
	}
}

/* Monster loading and factory. */
var MonsterFactory = function()
{
    var m_list = Array();

    this.loadMonsters=function()
    {
// TODO: load monsters from file.
        var monster = new DungeonMonster();
        monster.type = "MieserKadser";
        monster.image = "data/img/MieserKadser.jpg"
        monster.level = 0;
        monster.maxhealth = 5;
        monster.attack = 1;
        monster.health = monster.maxhealth;
        m_list.push(monster);
    }

    this.create=function(level)
    {
        // get a level between 0 and level.
        var lvl = parseInt(Math.random()*level);
        var trys=0;
        var index = -1;
        var oldlevel = 100000;
        while(!done)
        {
            var idx=parseInt(Math.random()*m_list.length)
            var monster = m_list[idx];
            if(monster.level==lvl)
            {
                index=idx;
                done=true;
                break;
            }
            // if level does not match, check if it is nearer than before.
            if(Math.abs(monster.level-lvl)<oldlevel)
            {
                oldlevel=lvl;
                index=idx;
            }
            trys++;
            if(trys>100)
                done=true;
        }

        if(index>0)
        {
            var monster = new DungeonMonster();
            monster.copyNew(m_list[index]);
            return monster;
        }
        return null;
    }
}