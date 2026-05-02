const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const devVars = fs.readFileSync('.dev.vars', 'utf8');
const url = devVars.split('\n').find(l => l.startsWith('SUPABASE_URL=')).split('=')[1];
const key = devVars.split('\n').find(l => l.startsWith('SUPABASE_SERVICE_ROLE_KEY=')).split('=')[1];
const sb = createClient(url, key);
sb.from('colleges').delete().ilike('slug', 'http%').then(res => console.log('Deleted:', res.error ? res.error : 'Success'));
sb.from('colleges').delete().eq('slug', 'https-beneficiary-nha-gov-in').then(res => console.log('Deleted 2:', res.error ? res.error : 'Success'));
