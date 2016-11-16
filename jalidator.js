var config = 
{
	login:
    {
    	username:
        {
        	minlength: 4,
            maxlength: 8,
        }
    }
}

    
// valudateValue(config.login.username, 'yamiodymel')
function validateValue(rule, value){}

// validate(config.login, {username: 'yamiodymel'})
function validate(rule, data)
{
	var res = { valid: true, invalid: false }

	/**
     * Data scanner
     */
     
	for(var n in data)
    {
    	// Initialize the result for the data
        res[n] = 
        {
        	valid    : true,
            invalid  : false,
            min      : false,
            max      : false,
            minLength: false,
            maxLength: false,
            pattern  : false,
            required : false,
            type     : false,
            sameAs   : false
        }
    
    	// Get the matched rule
        var r = rule[n],
        	d = data[n],
        	required  = r.required !== undefined,
            nullable  = r.nullable !== undefined,
            min       = r.min       || false,
            max       = r.max       || false,
            minLength = r.minLength || false,
            maxLength = r.maxLength || false,
            pattern   = r.pattern   || false,
            type      = r.type      || false,
            custom    = r.custom    || false,
            sameAs    = r.sameAs    || false
            
        /**
         * Required & Nullable
         */
         
        // Required but spaces only
        if(required && !/\S/.test(d))
        	res[n].required = true
        // Required but null and not nullable
        if(required && d === null && !nullable)
        	res[n].required = true
        
        /**
         * Length
         */
        
        // If shorter than minlength
        if(minLength !== false && d.length < minLength)
        	res[n].minLength = true
        // If longer than maxlength
        if(maxLength !== false && d.length > maxLength)
        	res[n].maxLength = true
        
        /**
         * Range
         */
        
        // If less than min
        if(min !== false && d < min)
        	res[n].min = true
        // If grater than max
        if(max !== false && d > max)
        	res[n].max = true
        
        /**
         * Pattern
         */
        
        // If not valid with the custom pattern
        if(pattern !== false && !pattern.test(d))
    		res[n].pattern = true
        
        /**
         * Custom Validator
         */
        
        //
        if(custom !== false && typeof custom === 'function')
        	if(!custom(d)) res[n].custom = true
        //
        if(custom !== false && typeof custom === 'array')
        {
        	var failed = false
            
            // Run custom validators
            custom.forEach((fn) => { if(!fn(d)) failed = true })
            
            if(failed) res[n].custom = true
        }
        
        /**
         * Same As
         */
        
        //
        if(sameAs !== false && data[sameAs] !== undefined && d !== data[sameAs])
        	res[n].sameAs = true
        
        /**
         * Type
         */
        
        if(type !== false)
        {
        	var ipv4 = /^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$/g.test(d),
            	ipv6 = /^((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*::((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*|((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4})){7}$/g.test(d)
        
            switch(type)
            {
                case 'email': 
                	if(!/\S+@\S+/.test(d))
                    	res[n].type = true
                    break
                case 'ip'   :
                	if(!ipv4 && !ipv6)
                    	res[n].type = true
                	break
                case 'ipv4' :
                	if(!ipv4)
                    	res[n].type = true
                	break
                case 'ipv6' : break
                	if(!ipv6)
                    	res[n].type = true
                    break
                case 'url'  : break
            }
        }
    }
    
    /**
     * Invalid, valid scanner
     */
     
     for(var n in res)
     {
         for(var o in res[n])
         {
         	 if(res[n][o] === true)
             {
                 res.valid      = false
                 res.invalid    = true
                 res[n].valid   = false
                 res[n].invalid = true
                 break
             }
         }
     }
}


validate(config.login, {username: 'yamiodymel'})
