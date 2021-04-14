/* The Dungeon Generator
	by Beni Yager
	@ 2021, GIT
	Grenchen Institute of Technology

	Map fields:
	.	: 	walkable, lighted area
		:	(space) nothing
	#	:	wall
	^	:	upwards (next dungeon)
	v	:	downwards (previous dungeon)

	// --> The generator also acts as actual dungeon.
	// Get Stuff with: getItems, getMonsters, getRoomProperties, getMap(x,y), getMessage
*/

// a map item
var DungeonMapItem = function(itemTypeChar)
{
	this.type=itemTypeChar;
	this.visible=false;  						// SET THIS TO TRUE TO SEE THE WHOLE MAP <---
}

// a pickable item
var DungeonItem = function()
{
	this.posX = 0;
	this.posY = 0;
	this.type="coin";
	this.mapchar="!";
	this.amount = 10;
}

// search a path from x1, y1 to x2, y2 and return its path.
// With path=AStar(x1,y1,x2,y2, dungeongenerator)
// path[0] is the start point, path[1] is the first step (!)
/*var AStarNode=function(x,y,previous)
{
	this.posX=x;
	this.posY=y;
	this.previous=previous;
}
var AStar = function(x1,y1,x2,y2,dungeon)
{
	this.path=Array();
	var openlist = Array();
	var closedlist=Array();
	var startPoint=new AStarNode(x1,y1,null);
	var done = false;
	var found = false;
	log("AStar begins "+x1+" "+y1+" --> "+x2+" "+y2);
	openlist.push(startPoint);

	var isInClosedList = function(listitem)
	{
		for(var i=0;i<closedlist.length;i++)
		{
			var c=closedlist[i];
			if(listitem.posX==c.posX && listitem.posY==c.posY)
				return true;
		}
		log(""+listitem.posX+" "+listitem.posY+" is NOT in closed list.");
		return false;
	}

	var step=0;
	while(!done)
	{
		step+=1;
		// get the first entry from openlist and remove it.
		var newopenlist=Array();
		var open=null;
		for(var i=0;i<openlist.length;i++)
		{
			if(i==0)
			{
				open=openlist[i];
			}else{
				newopenlist.push[open];
			}
		}
		openlist=newopenlist;
		// check if list is done.
		if(open==null)
		{
			log("Open is null.");
			done=true;
		}else{
			// else push that item into closed list.
			closedlist.push(open);
			log("open "+open.posX+" "+open.posY+" ("+x2+" "+y2+")");
			// check if open is the end point.
			if(open.posX==x2 && open.posY==y2)
			{
				log("AStar found a path.")
				found = open;
				done=true;
				break;
			}

			// now get all directions into open list.
			// needs the function isWalkable in dungeon.
			var listitem=null;
			if(dungeon.isWalkable(open.posX-1, open.posY))
			{
				listitem=new AStarNode(open.posX-1, open.posY, open);
				if(!isInClosedList(listitem))
					openlist.push(listitem)
			}
			if(dungeon.isWalkable(open.posX, open.posY-1))
			{
				listitem=new AStarNode(open.posX, open.posY-1, open);
				if(!isInClosedList(listitem))
					openlist.push(listitem)
			}
			if(dungeon.isWalkable(open.posX+1, open.posY))
			{
				listitem=new AStarNode(open.posX+1, open.posY, open);
				if(!isInClosedList(listitem))
					openlist.push(listitem)
			}
			if(dungeon.isWalkable(open.posX, open.posY+1))
			{
				listitem=new AStarNode(open.posX, open.posY+1, open);
				if(!isInClosedList(listitem))
					openlist.push(listitem)
			}
		}
	}
	// a path was found.
	var preversed=Array();
	if(found!=false)
	{
		while(found!=null)
		{
			preversed.push(found);
			found=found.previous;
		}
	}else{
		log("AStar did not find a path, sorry.")
	}
	// reverse the path.
	for(var i=preversed.length-1;i>=0;i--)
	{
		var o=preversed[i];
		log("AStar push "+o.posX+" "+o.posY);
		this.path.push(o);
	}
	return this.path;
}
*/

// a dungeon monster
var DungeonMonster = function()
{
	var me=this;
	this.health=5;
	this.mapchar="M";
	this.maxhealth=5;
	this.attack=1;
	this.posX=0;
	this.posY=0;
	this.type="MieserKadser";
	this.addHealth=function(value)
	{
		me.health+=value;
		if(me.health<0)
			me.health=0;
		if(me.health>me.maxhealth)
			me.health=me.maxhealth;
	}

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
		setMessage(msg);
	}
}

// a generated room, before it is in the map.
var DungeonRoom = function()
{
	var me = this;
	this.posX = 0;
	this.posY = 0;
	this.centerX = 0;
	this.centerY = 0;
	this.width = 3;
	this.height = 3;

	// check if this room intersects another one.
	this.intersects = function(room)
	{
		if(me.posX+me.width>=room.posX && me.posX<=room.posX+room.width &&
			me.posY+me.height>=room.posY && me.posY<=room.posY+room.height)
			return true;
		return false;
	}

	// set the size and center of this room.
	this.setSize=function(w, h)
	{
		me.width = w;
		me.height= h;
		me.centerX=me.posX+parseInt(me.width*0.5);
		me.centerY=me.posY+parseInt(me.height*0.5);
	}

	// set the position and center of this room.
	this.setPosition = function(posx, posy)
	{
		me.posX=posx;
		me.posY=posy;
		me.centerX=posx+parseInt(me.width*0.5);
		me.centerY=posy+parseInt(me.height*0.5);
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// create a dungeon.
var DungeonGenerator = function()
{
	var me = this;

	// the dungeon handles its list itself.
	this.nextDungeon = null;
	this.previousDungeon = null;

	var m_floorNumber = 0;
	this.getFloorNumber=function() {return m_floorNumber;}
	this.resetFloorNumber=function() {m_floorNumber=0;}

	var m_roomCount = 15;

	var m_mapSizeX = 100;
	var m_mapSizeY = 50;

	var m_minRoomX = 3;
	var m_minRoomY = 3;
	var m_maxRoomX = 5;
	var m_maxRoomY = 5;

	// the position of the first room should be
	// the same like the position of the last room
	// in the preceding dungeon.
	var m_initialX = 10;
	var m_initialY = 10;
	var m_initialWidth=0; // 0 for random.
	var m_initialHeight=0; // 0 for random.

	var playerStartX = 0;
	var playerStartY = 0;

	// percentages
	var m_itempercentage = 50;
	var m_anotheritempercentage = 50;
	var m_monsterpercentage = 30;
	var m_anothermonsterpercentage = 30;

	// the room properties.
	var m_rooms=Array();

	// the actual map.
	var m_map = new Array();

	// the items on the map.
	var m_items = Array();

	// the monsters on the map.
	var m_monsters = Array();
	this.getMonsters=function() {return m_monsters;};

	// get the player start position on the map.
	// pos.x, pos.y
	this.getPlayerStartPosition = function()
	{
		var pos= {
			x: playerStartX,
			y: playerStartY
		}
		return pos;
	}
	
	// move all monsters towards the player for one step.
	this.moveMonsters=function(player)
	{
//		log("MM Player: "+player.posX+" "+player.posY);
		var cp=Array();
		for(var m=0;m<m_monsters.length;m++)
		{
		//	log("MOVING MONSTER #"+m);
			var monster = m_monsters[m];
			monster.move(me, player);
			// remove monsters with health<=0
			if(monster.health>0)
				cp.push(monster);
		}
		m_monsters=cp;
	}

	// check if at this position is a monster.
	this.hasMonster=function(x,y)
	{
		for(var i=0;i<m_monsters.length;i++)
		{
			var m=m_monsters[i];
			if(m.posX==x && m.posY==y)
				return m;
		}
		return false;
	}

	this.getItems=function() {return m_items;}
	this.setItems=function(items) {m_items=items;}

	// check if an item is at position x,y
	this.checkForItem=function(x,y)
	{
		for(var i=0;i<m_items.length;i++)
		{
			var item=m_items[i];
			if(item.posX==x && item.posY==y)
				return true;
		}
		return false;
	}
	
	// set some properties BEFORE you call generate.
	this.setProperties =function(props)
	{
		if('floornumber' in props)
			m_floorNumber = props.floornumber;
		if('initialx' in props)
			m_initialX=props.initialx;
		if('initialy' in props)
			m_initialY=props.initialy;
		if('initialwidth' in props)
			m_initialWidth=props.initialwidth;
		if('initialheight' in props)
			m_initialHeight=props.initialheight;
		if('roomcount' in props)
			m_roomCount = props.roomcount;
		if('mapsizex' in props)
			m_mapSizeX=props.mapsizex;
		if('mapsizey' in props)
			m_mapSizeY=props.mapsizey;
		if('minroomx' in props)
			m_minRoomX=props.minroomx;
		if('minroomy' in props)
			m_minRoomY=props.minroomy;
		if('maxroomx' in props)
			m_maxRoomX=props.maxroomx;
		if('maxroomy' in props)
			m_maxRoomY=props.maxroomy;
		if('monsterpercentage' in props)
			m_monsterpercentage=props.monsterpercentage;
		if('anothermonsterpercentage' in props)
			m_anothermonsterpercentage=props.anothermonsterpercentage;
		if('itempercentage' in props)
			m_itempercentage=props.itempercentage;
		if('anotheritempercentage' in props)
			m_anotheritempercentage=props.anotheritempercentage;
	}

	// generate a dungeon with the given properties.
	this.generate = function()
	{
		m_rooms = Array();
		log("Generating Dungeon...");
		log("1. Creating Rooms")
		for(var i=0;i<m_roomCount;i++)
		{
			var room = new DungeonRoom();
			var sizex=m_minRoomX + parseInt(Math.random()*(m_maxRoomX-m_minRoomX));
			var sizey=m_minRoomY + parseInt(Math.random()*(m_maxRoomY-m_minRoomY));
			if(i==0 && m_initialWidth!=0)
				sizex=m_initialWidth;
			if(i==0 && m_initialHeight!=0)
				sizey=m_initialHeight;
			room.setSize(sizex,sizey);
			// initial start position:
			if(i==0)
			{
				room.setPosition(m_initialX,m_initialY);
			}else{
				room.setPosition(parseInt(Math.random()*(m_mapSizeX-room.width-2))+1, 
								 parseInt(Math.random()*(m_mapSizeY-room.height-2))+1);
			}
			m_rooms.push(room);
		}

		log("2. Reposition Rooms");
		done=false;
		steps=0;
		while(done==false)
		{
			done=true;
			steps+=1;
			log("step "+steps);
			for(var i=1;i<m_rooms.length;i++)
			{
				// don't move room number 0!

//				log("pos room "+i);
				// check for intersect in each room.
				for(var q=0;q<m_rooms.length;q++)
				{
					if(q!=i)
					{
						if(m_rooms[i].intersects(m_rooms[q]))
						{
							log("! intersection found, #"+i+"<>#"+q)
							m_rooms[i].setPosition(parseInt(Math.random()*(m_mapSizeX-room.width-2))+1,
												 parseInt(Math.random()*(m_mapSizeY-room.height-2))+1);
							done=false;
						}
					}
				}
			}
			if(steps>=100)
				done=true;
		}

		log("2.1 set player start position");
		playerStartX=m_rooms[0].posX+parseInt(Math.random()*m_rooms[0].width);
		playerStartY=m_rooms[0].posY+parseInt(Math.random()*m_rooms[0].height);

		log("3. import rooms into map");
		log("3.1 generate map");
		m_map = me.createEmptyMap();
	
		log("3.2 implement rooms")
		for(var r=0;r<m_rooms.length;r++)
		{
			var room=m_rooms[r];
			log("room #"+r+" x"+room.posX+" y"+room.posY+" w"+room.width+" h"+room.height);
			for(var ry=0;ry<room.height;ry++)
			{
				for(var rx=0;rx<room.width;rx++)
				{
					var posx=room.posX+rx;
					var posy=room.posY+ry;
					me.setMap(posx,posy, ".");
				}
			}
		}

		log("4. create connections");
		log("4.1 sort rooms, but only for connections");
		var done = false;
		var rr=[...m_rooms];
		rr.sort(function(a,b){return (a.posX+a.posY)-(b.posX+b.posY);});
		log("4.2 connect")
		// create connections between all rooms one after eachother.
		for(var i=0;i<rr.length-1;i++)
		{
			var room1=rr[i];
			var room2=rr[i+1];
			
			var x1=room1.centerX;
			var x2=room2.centerX;

			if(x1>x2)
			{
				for(var x=x2;x<x1;x++)
				{
					me.setMap(x,room1.centerY,".");
				}
			}else{
				for(var x=x1;x<=x2;x++)
				{
					me.setMap(x,room1.centerY,".");
				}	
			}

			// same with y and x2
			var y1=room1.centerY;
			var y2=room2.centerY;
			if(y1>y2)
			{
				for(var y=y2;y<y1;y++)
				{
					me.setMap(x2,y,".");
				}
			}else{
				for(var y=y1;y<y2;y++)
				{
					me.setMap(x2,y, ".");
				}
			}
		}
		
		// border generation v2: around all . when it is a space ' '.
		log("5. create borders")
		this.createBorders();

		log("6. place exit")
		// get last room and place exit in it.
		var room = m_rooms[m_rooms.length-1];
		this.setMap(room.posX+parseInt(Math.random()*room.width), room.posY+parseInt(Math.random()*room.height),'^');

		log("7. create items and monsters")
		m_items = Array();
		m_monsters=Array();
		for(var r=0;r<m_rooms.length;r++)
		{
			var done = false;
			var room = m_rooms[r];
			// place items
			while(!done)
			{
				done = true;
				var place=Math.random()*100;
				// TODO: globalize that
					// itempercentage
					// anotheritempercentage
				// place the item or not?
				if(place<=m_itempercentage)
				{
					var item = new DungeonItem();

					// TODO: load from item list
					var t= parseInt(Math.random()*2);
					switch(t)
					{
						case 1:
							item.type="health"
							item.mapchar="&hearts;"
							break;
						default:
							item.type="coin"
							item.mapchar="$";
							break;
					}
					// TODO: change percentage by player level or such.
					item.amount = parseInt(Math.random()*15)+1;
					item.posX = room.posX+parseInt(Math.random()*room.width);
					item.posY= room.posY+parseInt(Math.random()*room.height);
					m_items.push(item);
				}
				// maybe place another item?
				var place=Math.random()*100;
				if(place<=m_anotheritempercentage)
					done = false;
			}

			// no monsters in start room, please.
			if(r==0)
				continue;

			// place monsters
			done=false;
			while(!done)
			{
				done = true;
				var place=Math.random()*100;
				// place the item or not?
				if(place<=m_monsterpercentage)
				{
					var monster = new DungeonMonster();
					// TODO: load from list.
					monster.posX = room.posX+parseInt(Math.random()*room.width);
					monster.posY= room.posY+parseInt(Math.random()*room.height);
					m_monsters.push(monster);
				}
				// maybe place another item?
				var place=Math.random()*100;
				if(place<=m_anothermonsterpercentage)
					done = false;
			}
		}
	};

	// create # walls around .
	this.createBorders=function()
	{
		for(var y=0;y<m_map.length;y++)
		{
			var row=m_map[y];
			for(var x=0;x<row.length;x++)
			{
				if(me.getMap(x,y)==".")
				{
					for(var xx=-1;xx<=1;xx++)
					{
						for(var yy=-1;yy<=1;yy++)
						{
							if(me.getMap(x+xx,y+yy)==" ") me.setMap(x+xx,y+yy,"#");
						}
					}	
				}
			}
		}
	}

	// check if a position is in the created map, respecting array sizes.
	var _isInMap=function(x,y)
	{
		if(y>=0 && y<m_map.length)
		{
			var row=m_map[y];
			if(x>=0 && x<row.length)
				return true;
		}
		return false;
	}

	// get the map type at a specific position
	this.getMap=function(x,y)
	{
		if(_isInMap(x,y))
		{
			return m_map[y][x].type;
		}
		return false;
	}

	// check if a field is walkable (with a . or something other)
	this.isWalkable = function(posX, posY)
	{
		switch(this.getMap(posX, posY))
		{
			case '.':
			case '^':
			case 'v':
				return true;
				break;
			default:
				return false;
		}
		return false;
	}

	// set a map item
	this.setMap = function(posx,posy, type)
	{
		if(_isInMap(posx,posy))
		{
//			log("set map "+posx+" "+ posy+" "+ type);
			m_map[posy][posx].type=type;
		}
	}

	// show or hide a map item.
	this.setVisible=function(posx, posy, visible=true)
	{
		if(_isInMap(posx,posy))
		{
			m_map[posy][posx].visible = visible;
		}
	}
	// create a map with empty map items in the right size and return it.
	this.createEmptyMap = function()
	{
		var m= Array();
		for(var y=0;y<m_mapSizeY;y++)
		{
			var row=Array();
			for(var x=0;x<m_mapSizeX;x++)
			{
				row.push(new DungeonMapItem(" "));
			}
			m.push(row)
		}	
		return m;
	}

	// get the room properties.
	this.getRoomProps=function() {return m_rooms;}

	// print the stuff on your display.
	this.print = function(player)
	{
		//log("Printing Dungeon");
		
		var result=""
		for(var y=0;y<m_map.length;y++)
		{
			var row = m_map[y];
			for(var x=0;x<row.length;x++)
			{
				var t=row[x].type;
				var r=row[x].type;

				// break if not visible.
				if(row[x].visible==false)
				{
					result+="&nbsp;"
					continue;
				}

				// select the proper character and color.
				switch(t)
				{
					case '<': r="&lt;";break;
					case '>': r="&gt;";break;
					case ' ': r="&#9617;";break;
					case '#': r="&#9608;";break;
					case '.': r="<b class='ground'>.</b>";break;
					case '^': r="<b class='stairs'>O</b>";break;
					case 'v': r="<b class='stairs'>V</b>";break;
					default:
						break;
				}

				// maybe show item.
				var itm;
				for(var it=0;it<m_items.length;it++)
				{
					itm=m_items[it];
					if(itm.posX==x && itm.posY==y)
					{
						r="<b class='item'>"+itm.mapchar+"</b>";
					}
				}

				// maybe show monster.
				var monster;
				for(var mt=0;mt<m_monsters.length;mt++)
				{
					monster=m_monsters[mt];
					if(monster.posX==x && monster.posY==y)
					{
						r="<b class='monster'>"+monster.mapchar+"</b>";
					}
				}

				// maybe set player position.
				if(x==player.getPosition().x && y==player.getPosition().y)
					r="<b class='player'>@</b>";

				result+=r;
			}
			result+="<br />"
		}
		return result;
	};
};