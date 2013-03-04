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
				"�I�u�W�F�N�g:  Table",					"�I�u�W�F�N�g:  01_Table", 
				"�I�u�W�F�N�g:  UserDefinedFunction", 	"�I�u�W�F�N�g:  02_UserDefinedFunction",
				"�I�u�W�F�N�g:  StoredProcedure",		"�I�u�W�F�N�g:  03_StoredProcedure",
				"�I�u�W�F�N�g:  ForeignKey",			"�I�u�W�F�N�g:  04_ForeignKey",
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
