const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL is missing in .env.local');
  process.exit(1);
}

// Check if serviceRoleKey is actually the service_role key, not the anon key
function isServiceRole(key) {
  if (!key) return false;
  try {
    const payload = JSON.parse(Buffer.from(key.split('.')[1], 'base64').toString('utf8'));
    return payload.role === 'service_role';
  } catch {
    return false;
  }
}

async function run() {
  if (!isServiceRole(serviceRoleKey)) {
    console.log('\n======================================================');
    console.log('NOTICE: SUPABASE_SERVICE_ROLE_KEY in .env.local is not a service_role key.');
    console.log('To seed credentials directly into your Supabase database:');
    console.log('1. Open your Supabase Dashboard: ' + supabaseUrl);
    console.log('2. Navigate to "SQL Editor" in the left sidebar');
    console.log('3. Copy & paste the contents of:');
    console.log('   supabase/migrations/003_admin_credentials.sql');
    console.log('4. Click "Run"');
    console.log('======================================================\n');
    return;
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const email = 'ahsanmukhtiar@gmail.com';
  const password = 'ahsan12345';

  console.log(`Creating/updating admin user: ${email}...`);

  // Check if user exists
  const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (listError) {
    console.error('Failed to list users:', listError.message);
    return;
  }

  const existing = users.find((u) => u.email === email);

  if (!existing) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: 'Ahsan Mukhtiar',
        role: 'owner',
      },
    });

    if (error) {
      console.error('Error creating user:', error.message);
      return;
    }

    console.log('User created successfully:', data.user.id);
  } else {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
      user_metadata: {
        full_name: 'Ahsan Mukhtiar',
        role: 'owner',
      },
    });

    if (error) {
      console.error('Error updating user:', error.message);
      return;
    }

    console.log('User password updated successfully for:', data.user.id);
  }

  console.log('\nAdmin credentials configured!');
  console.log('Username / Email: ahsanmukhtiar@gmail.com');
  console.log('Password:         ahsan12345');
}

run().catch(console.error);
