function noXLSX(master) 
{
	this.master  = master;
	this.name    = 'noXLSX';
	this.x       = 190;
	this.y       = 250; 
	this.content = {
		data: '\
			<label \
				for="UploadText"\
			>\
				{0}\
			</label> \
			<input \
				type="text"\
				id="UploadText"\
				title="{1}"\
			>',
        
        'ru-RU': ['Введите роли на сервере', 'Формат: роль1, роль2, ...'],
		'eng':   ['Write User roles on server', 'Format: role1, role2, ...']
	}

	this.goodResult = {
		'ru-RU': 'Конфликты не обнаружены.',
		'eng':   'Clean!'
	}
	
	this.__chekProcedure__ = function()
	{
		this.master.__chekProcedure__(this.afterChecking);
	}

	this.formatConflicts = function(dataName, data)
	{
		var result ='\nsystem: ' + dataName;

		for (var role in data) {
			if (data[role]) {
				result += "\nRole: " + role  + "\nConflict: " + data[role];
			}
		}

		if (('\nsystem: ' + dataName) === result) 
		{
			return '';
		} else {
			return result;
		}
	} 

	this.afterChecking = function(self, data)
	{
		var result = '';

		for (var system in data) 
		{
			result += self.formatConflicts(system, data[system])
		}

		if (result === '') alert(self.goodResult);
		else               alert(result);
	}

	this.converter = function(value)
	{
		var curent = value.split(", ");

		return curent;
	}

	this.onkeyup = function(value)
	{
		var cleanValue = value.replace(/[^a-z]/g, "");

		if (cleanValue !== "") this.master.data = this.converter(value);
		else                   this.master.data = null;
	}

	this.onLoad = function()
	{
		var UploadText = document.getElementById('UploadText'),
			self       = this;
		this.button    = UploadText;

		UploadText.setAttribute('onkeyup', function() {
			this.value = this.value.replace(/[^a-zA-Z 1-9_,]/g, "");
			self.onkeyup(this.value);
		});
		
		window.resizeTo(this.y, this.x);
	}

	this.clear = function()
	{
		this.button.value = "";
	}
}