/* The Dungeon Generator
	by Beni Yager
	@ 2021, GIT
	Grenchen Institute of Technology
*/

// a map item
var DungeonMapItem = function(itemTypeChar)
{
	this.type=itemTypeChar;
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
	this.setsize=function(w, h)
	{
		me.width = w;
		me.height= h;
		me.centerX=me.posX+parseInt(me.width*0.5);
		me.centerY=me.posY+parseInt(me.height*0.5);
	}

	// set the position and center of this room.
	this.setposition = function(posx, posy)
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

	var m_minRoomX = 2;
	var m_minRoomY = 2;
	var m_maxRoomX = 10;
	var m_maxRoomY = 10;
	
	var map = Array();

	this.generate = function()
	{
		var rooms = Array();
		log("Generating Dungeon...");
		log("1. Creating Rooms")
		for(var i=0;i<m_roomCount;i++)
		{
			var room = new DungeonRoom();
			room.setsize(m_minRoomX + parseInt(Math.random()*(m_maxRoomX-m_minRoomX)),
						m_minRoomY + parseInt(Math.random()*(m_maxRoomY-m_minRoomY)));
			// initial start position:
			room.setposition(parseInt(Math.random()*(m_mapSizeX-room.width-1))+1, 
							 parseInt(Math.random()*(m_mapSizeY-room.height-1))+1);
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
			for(var i=0;i<rooms.length;i++)
			{
				log("pos room "+i);
				// check for intersect in each room.
				for(var q=0;q<rooms.length;q++)
				{
					if(q!=i)
					{
						if(rooms[i].intersects(rooms[q]))
						{
							log("intersection found, #"+i+"<>#"+q)
							rooms[i].setposition(parseInt(Math.random()*(m_mapSizeX-room.width-1))+1,
												 parseInt(Math.random()*(m_mapSizeY-room.height-1))+1);
							done=false;
						}
					}
				}
			}
			if(steps>=100)
				done=true;
		}

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
					_setMap(posx,posy, ".");
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
					_setMap(x,room1.centerY,".");
				}
			}else{
				for(var x=x1;x<=x2;x++)
				{
					_setMap(x,room1.centerY,".");
				}	
			}

			// same with y and x2
			var y1=room1.centerY;
			var y2=room2.centerY;
			if(y1>y2)
			{
				for(var y=y2;y<y1;y++)
				{
					_setMap(x2,y,".");
				}
			}else{
				for(var y=y1;y<y2;y++)
				{
					_setMap(x2,y, ".");
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
				if(_getMap(x,y)==".")
				{
					for(var xx=-1;xx<=1;xx++)
					{
						for(var yy=-1;yy<=1;yy++)
						{
							if(_getMap(x+xx,y+yy)==" ") _setMap(x+xx,y+yy,"#");
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
	var _getMap=function(x,y)
	{
		if(_isInMap(x,y))
		{
			return map[y][x].type;
		}
		return false;
	}

	// set a map item
	var _setMap = function(posx,posy, type)
	{
		if(_isInMap(posx,posy))
		{
//			log("set map "+posx+" "+ posy+" "+ type);
			map[posy][posx].type=type;
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

	this.print = function()
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
					default:
						break;
				}
				result+=r;
			}
			result+="<br />"
		}
		return result;
	};
};