Array.prototype.isInArray = function(key)
{
	for (var n in this)
	{
		value = this[n];
		
		if (value === key) return true;
	}

	return false;
}