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

	var playerStartX = 0;
	var playerStartY = 0;

	// the actual map.
	var map = Array();

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
		var rooms = Array();
		log("Generating Dungeon...");
		log("1. Creating Rooms")
		for(var i=0;i<m_roomCount;i++)
		{
			var room = new DungeonRoom();
			room.setSize(m_minRoomX + parseInt(Math.random()*(m_maxRoomX-m_minRoomX)),
						m_minRoomY + parseInt(Math.random()*(m_maxRoomY-m_minRoomY)));
			// initial start position:
			if(i==0)
			{
				room.setPosition(m_initialX,m_initialY);
			}else{
				room.setPosition(parseInt(Math.random()*(m_mapSizeX-room.width-2))+1, 
								 parseInt(Math.random()*(m_mapSizeY-room.height-2))+1);
			}
			rooms.push(room);
		
		}
		log("2. Reposition Rooms");

		done=false;
		steps=0;
		while(done==false)
		{
			done=true;
			steps+=1;
			log("step "+steps);
			for(var i=1;i<rooms.length;i++)
			{
				// don't move room number 0!

//				log("pos room "+i);
				// check for intersect in each room.
				for(var q=0;q<rooms.length;q++)
				{
					if(q!=i)
					{
						if(rooms[i].intersects(rooms[q]))
						{
							log("! intersection found, #"+i+"<>#"+q)
							rooms[i].setPosition(parseInt(Math.random()*(m_mapSizeX-room.width-2))+1,
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
		playerStartX=rooms[0].posX+parseInt(Math.random()*rooms[0].width);
		playerStartY=rooms[0].posY+parseInt(Math.random()*rooms[0].height);

		log("3. import rooms into map");
		log("3.1 generate map");
		map = me.createEmptyMap();
	
		log("3.2 implement rooms")
		for(var r=0;r<rooms.length;r++)
		{
			var room=rooms[r];
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
		// create connections between all rooms one after eachother.
		for(var i=0;i<rooms.length-1;i++)
		{
			var room1=rooms[i];
			var room2=rooms[i+1];
			
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
		for(var y=0;y<map.length;y++)
		{
			var row=map[y];
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
	};
	
	// check if a position is in the created map, respecting array sizes.
	var _isInMap=function(x,y)
	{
		if(y>=0 && y<map.length)
		{
			var row=map[y];
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
			return map[y][x].type;
		}
		return false;
	}

	// check if a field is walkable (with a . or something other)
	this.isWalkable = function(posX, posY)
	{
		switch(this.getMap(posX, posY))
		{
			case '.':
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
			map[posy][posx].type=type;
		}
	}

	// show or hide a map item.
	this.setVisible=function(posx, posy, visible=true)
	{
		if(_isInMap(posx,posy))
		{
			map[posy][posx].visible = visible;
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

	this.print = function(player)
	{
		log("Printing Dungeon");
		
		var result=""
		for(var y=0;y<map.length;y++)
		{
			var row = map[y];
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
					default:
						break;
				}

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