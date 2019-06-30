function withXLSX(master) 
{
	this.x       = 170;
	this.y       = 240; 
	this.name    = 'withXLSX';
	this.master  = master;
	this.content = {
		data:'\
			<button \
				title="{0}"\
				id="UploadXLSX"\
			>\
				{1} XLSX\
			</button>',

		'ru-RU': ['Загрузите отчет в формате XLSX', 'Загрузить'],
		'eng':   ['Upload report in XLSX', 'Upload']
	}

	this.__chekProcedure__ = function()
	{
		//this.master.__chekProcedure__(this.afterChecking);
	}

	this.afterChecking = function(data)
	{
		alert(data)
	}
	
	this.onClick = function()
	{
		this.master.data = [];	
	}
	
	this.onLoad = function()
	{
		var UploadXLSX = document.getElementById('UploadXLSX'),
			self       = this;
		this.button    = UploadXLSX;
		
		UploadXLSX.setAttribute('onclick', function() {self.onClick()});
		
		window.resizeTo(this.y, this.x);
	}
}