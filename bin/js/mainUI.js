function mainUI(matrix)
{
	this.content = {
		data: '\
			<select id="server-selection" style="width: 100%">\
				<option value="">{0}</option>\
			</select>\
			<div id="fakeForm">\
				<button\
					id="checkButton"\
					disabled\
					style="width: 100%"\
				>\
				{1}\
			</button>\
			</div id="fakeForm">',
		'ru-RU': ['Сервер', 'Проверка'],
		'eng':   ['Server', 'Checking']
	}

	this.server      = null;
	this.mode        = null; 
	this.data        = null;
	this.activeError = null;
	this.matrix      = matrix;
	this.error       = {
		'ru-RU': {
			noXLSX : [
				'Данные некорректны.', 
				'Не выбран сервер.', 
				'Преднастройки не указаны.'
			],

			withXLSX: [
				'Файл не загружен.', 
				'Не выбран сервер.', 
				'Преднастройки не указаны.'
			]
		},
		
		'eng': {
			noXLSX : [
				'Data is missing.',
				'No server selected.',
				'No presets specified.'
			],

			withXLSX: [
				'File not loaded.',
				'No server selected.',
				'No presets specified.'
			]
		}
	};

	this.findRoleOnSystems = function(role)
	{
		var data = {'system': '__NA__', 'role': role}

		for (var key in this.server)
		{
			var system = this.server[key];

			if (system[role] !== undefined) 
			{
				data.system = key;
				break;
			}
		}

		return data;
	}

	this.generateSystemsDiction = function(systemsArray)
	{
		var result = {
			'__NA__': []
		};

		for (var system in systemsArray)
		{
			result[system] = [];
		}

		return result;
	}

	this.generateDictionOfSystemsAndRoles = function(systems)
	{
		var curSystems = systems;

		for (var n in this.data)
		{
			var role    = this.data[n],
				diction = this.findRoleOnSystems(role);

			curSystems[diction.system].push(role);
		}

		return curSystems;
	}
	
	this.isConflictFinded =function(role, sytemData, matrixForRole)
	{
		conflicts = [];

		for (var n in sytemData)
		{
			var iRole = sytemData[n];
			
			if (!matrixForRole.isInArray(iRole) && iRole !== role)
			{
				conflicts.push(iRole);
			}
		}

		return (conflicts.length > 0) ? conflicts:false;
	}

	this.checkRolesForConflict = function(sytemData, systemName)
	{
		var result  = {},
			curRole = this.server[systemName];;

		for (var role in curRole) 
		{
			if (sytemData.isInArray(role)) {
				result[role] = this.isConflictFinded(role, sytemData, curRole[role]);
			}
		}

		return result;
	}

	this.findConflicts = function(systemsAndRoles)
	{
		var result = {};

		for (var name in systemsAndRoles)
		{
			var system = systemsAndRoles[name];
			if (name !== '__NA__') 
			{
				result[name] = this.checkRolesForConflict(system, name);
			}
		}

		return result;
	}

	this.clear = function()
	{
		this.data = null;
		this.mode.clear();
	}

	this.__chekProcedure__ = function(methodAfterCheck)
	{
		var systemTable = this.generateSystemsDiction(this.server),
			sysAndRoles = this.generateDictionOfSystemsAndRoles(systemTable),
			checked     = this.findConflicts(sysAndRoles);
		
		methodAfterCheck(this.mode, checked);
		this.clear();
	}

	this.createErrorMsg = function(text) 
	{
		var checkButton = document.getElementById('checkButton'),
			rect        = checkButton.getBoundingClientRect(),
			errMsg      = document.createElement("p");

		errMsg.className  = "errMsg";
		errMsg.innerHTML = '! ' + text;

		checkButton.parentNode.insertBefore(errMsg, checkButton.nextSibling);
		window.resizeTo(this.mode.y, this.mode.x + 40);
		
		return errMsg;
	}

	this.findError = function()
	{
		if ((this.data === null) && (this.server !== null)) {
			return this.createErrorMsg(this.error[0]);
		}
		else if ((this.server === null) && (this.data !== null)) {
			return this.createErrorMsg(this.error[1]);
		}
		else if ((this.data === null) && (this.server === null)) {
			return this.createErrorMsg(this.error[2]);
		} else {
			return null; 
		} 
	}

	this.removeActiveError = function(event)
	{
		var checkButton = document.getElementById('checkButton');

		if ((this.activeError !== null) && (event.srcElement !== checkButton))
		{
			this.activeError.parentNode.removeChild(this.activeError);
			this.activeError = null;

			window.resizeTo(this.mode.y, this.mode.x);
		}
	}

	this.readiness = function(event)
	{
		var ready       = (this.data !== null) && (this.server !== null),
			checkButton = document.getElementById('checkButton'),
			condition   = (this.activeError === null) && (event.srcElement === checkButton);

		if (ready) checkButton.disabled = false;
		else       checkButton.disabled = true;

		this.removeActiveError(event);
		if (condition) this.activeError = this.findError();
	}

	this.selectOnChange = function(self)
	{
		return function()
		{
			var selected = this.value;

			if (selected !== "") self.server = self.matrix[selected];
			else 				 self.server = null;
		}
	}

	this.onLoad = function()
	{
		var fakeForm    = document.getElementById('fakeForm'),
			checkButton = document.getElementById('checkButton'),
			self        = this;
		this.select   = document.getElementById('server-selection');

		for (var server in BaseMatrix)
		{
			var option = document.createElement("option");
			
			option.innerHTML = server;
			option.value     = server;

			this.select.appendChild(option);
		}
        
        checkButton.setAttribute('onclick',   function() {self.mode.__chekProcedure__();});
		fakeForm.setAttribute('onmouseover',  function() {self.readiness(window.event)});
		fakeForm.setAttribute('onmouseleave', function() {self.removeActiveError(window.event)});
		
		this.select.setAttribute('onchange', this.selectOnChange(this));
	}
	
	this.format = function(data, args)
	{
		for (var n in args) 
		{
			var key  = '\{' + n + '\}',
				word = args[n];

			data = data.replace(key, word);
		}

		return data;
	}

	this.setContentLanguage = function(lang)
	{
		if (this.content[lang] !== undefined) {
			this.error           = this.error[lang][this.mode.name];
			this.mode.content    = this.format(this.mode.content.data, this.mode.content[lang]);
			this.content         = this.format(this.content.data, this.content[lang]);
			this.mode.goodResult = this.mode.goodResult[lang];

			document.body.innerHTML = this.mode.content + this.content;
		} else  {
			this.setContentLanguage('eng');
		}
	}

	this.setMode = function(mode)
	{
		this.mode = new mode(this);

		this.setContentLanguage(navigator.systemLanguage);
		this.mode.onLoad();
		this.onLoad();
	}
}