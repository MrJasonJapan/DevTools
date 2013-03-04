	var target = new Array();
	
	target.push(".\\sql");

	
	main();
	
	function main()
	{
		var fs = WScript.CreateObject("Scripting.FileSystemObject");
		
		for(var j=0;j<target.length;j++)
		{
			var target_folder = fs.getFolder(target[j]);
			var file = new Enumerator(target_folder.Files);

			for(; !file.atEnd(); file.moveNext())
			{
				var name = file.item().Name;
				
				if(name.substr(name.length - 4, 4).toLowerCase() == ".sql")
				{
					var text = file.item().OpenAsTextStream(1,-1);
					var data = text.ReadAll();
					text.Close();
					
					
					text = fs.CreateTextFile(target[j] + "\\" + name + ".txt", true, true);
					text.Write(doConvert(data));
					text.Close();
				}
			}
		}
	}

	function doConvert(text)
	{
		var replaceList = new Array(
				"オブジェクト:  Table",					"オブジェクト:  01_Table", 
				"オブジェクト:  UserDefinedFunction", 	"オブジェクト:  02_UserDefinedFunction",
				"オブジェクト:  StoredProcedure",		"オブジェクト:  03_StoredProcedure",
				"オブジェクト:  ForeignKey",			"オブジェクト:  04_ForeignKey",
				"Object:  Table",						"Object:  01_Table", 
				"Object:  UserDefinedFunction", 		"Object:  02_UserDefinedFunction",
				"Object:  StoredProcedure",				"Object:  03_StoredProcedure",
				"Object:  ForeignKey",					"Object:  04_ForeignKey",
				"Object:  Default",						"Object:  05_Default"
				);
				
		var data = text;
		
		for(var i=0;i<replaceList.length;i+=2)
		{
			data = data.split(replaceList[i+0]).join(replaceList[i+1]);
		}
		data = data.split('/****** Object:  ');
		
		data.sort();
		
		for(var i=0;i<data.length;i++)
		{
			if(0 <= data[i].indexOf('******/'))
			{
				var items = data[i].split('\r\n');
				
				items[0] = items[0].substr(0,items[0].length - 43) + "******/";
				
				data[i] = items.join('\r\n');
			}
		}
		data = data.join('/****** Object:  ');

		for(var i=0;i<replaceList.length;i+=2)
		{
			data = data.split(replaceList[i+1]).join(replaceList[i+0]);
		}
		
		return data;
	}
