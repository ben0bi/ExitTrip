/* The Dungeon Generator
	by Beni Yager
	@ 2021, GIT
	Grenchen Institute of Technology

	Map fields:
	.	: 	walkable, lighted area
		:	(space) nothing
	#	:	wall
	^	:	upwards (next dungeon)
*/

// a map item
var DungeonMapItem = function(itemTypeChar)
{
	this.type=itemTypeChar;
	this.visible=false;
}

// a pickable item
var DungeonItem = function()
{
	this.posX = 0;
	this.posY = 0;
	this.type="coin";
	this.amount = 10;
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

// create a dungeon.
var DungeonGenerator = function()
{
	var me = this;

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

	// the room properties.
	var m_rooms=Array();

	// the actual map.
	var m_map = Array();

	// the items on the map.
	var m_items = Array();

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
	
	// set some properties BEFORE you call generate.
	this.setProperties =function(props)
	{
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

// create room walls v1: around rooms
/*			for(var rx=-1;rx<room.width+1;rx++)
			{
				var posx=room.posX+rx;
				_setMap(posx, room.posY-1,"#");
				_setMap(posx, room.posY+room.height,"#");
			}

			for(var ry=0;ry<room.height;ry++)
			{
				var posy=room.posY+ry;
				_setMap(room.posX-1,posy, "#");
				_setMap(room.posX+room.width, posy,"#");
			}
*/
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

		log("7. create items")
		var itempercentage=50;
		var anotheritempercentage=50;

		m_items = Array();
		for(var r=0;r<m_rooms.length;r++)
		{
			var done = false;
			var room = m_rooms[r];
			while(!done)
			{
				done = true;
				var place=Math.random()*100;
				// TODO: globalize that
					// itempercentage
					// anotheritempercentage
				// place the item or not?
				if(place<=itempercentage)
				{
					var item = new DungeonItem();
					item.amount = parseInt(Math.random())
					item.posX = room.posX+parseInt(Math.random()*room.width);
					item.posY= room.posY+parseInt(Math.random()*room.height);
					m_items.push(item);
				}
				// maybe place another item?
				var place=Math.random()*100;
				if(place<=anotheritempercentage)
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
				switch(t)
				{
					case '<': r="&lt;";break;
					case '>': r="&gt;";break;
					case ' ': r="&nbsp;";break;
					case '.': r="<b class='ground'>.</b>";break;
					case '^': r="<b class='stairs'>&#8796;</b>";break;
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
						switch(itm.type)
						{
							case 'coin':
								r="<b class='item'>$</b>"
								break;
							default:
								r="<b class='item'>i</b>"
						}
					}
				}

				// maybe set player position.
				if(x==player.getPosition().x && y==player.getPosition().y)
					r="<b class='player'>@</b>";

				if(row[x].visible==true)
					result+=r;
				else
					result+="&nbsp;"
			}
			result+="<br />"
		}
		return result;
	};
};