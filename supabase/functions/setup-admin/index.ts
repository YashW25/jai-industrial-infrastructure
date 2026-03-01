import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email, password, full_name, role, club_id, action, user_id } = await req.json()

    console.log('Setup admin request:', { email, role, club_id, action })

    // Handle password reset action
    if (action === 'reset_password' && user_id) {
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        { auth: { autoRefreshToken: false, persistSession: false } }
      )

      const { error: resetError } = await supabaseAdmin.auth.admin.updateUserById(user_id, {
        password: '12345678',
      })

      if (resetError) {
        console.error('Error resetting password:', resetError)
        return new Response(
          JSON.stringify({ error: resetError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('Password reset successfully for user:', user_id)
      return new Response(
        JSON.stringify({ success: true, message: 'Password reset to 12345678' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === email)

    let userId: string

    if (existingUser) {
      console.log('User already exists, updating...')
      userId = existingUser.id
    } else {
      // Create the user
      const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

      if (createError) {
        console.error('Error creating user:', createError)
        return new Response(
          JSON.stringify({ error: createError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      userId = userData.user.id
    }

    const appRole = ['super_admin', 'platform_admin', 'club_admin', 'editor'].includes(role) ? role : 'club_admin';
    const adminName = full_name || 'Admin User';
    // Platform-wide roles don't necessarily have a single club_id
    const targetClubId = (appRole === 'super_admin' || appRole === 'platform_admin') ? null : club_id;

    // 1. Add/Update Profile
    // We check if it exists first, because upsert might be tricky with constraint names
    const { data: existingProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    if (!existingProfile) {
      const { error: profileCreateError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          user_id: userId,
          full_name: adminName,
          enrollment_number: email, // Using email as enrollment number for admins
          is_profile_complete: true,
          branch: 'N/A', // Required fields for standard users
          college: 'N/A',
          mobile: 'N/A',
          year: 'N/A'
        })
      if (profileCreateError) {
        console.error('Error creating admin profile:', profileCreateError)
      }
    } else {
      await supabaseAdmin
        .from('user_profiles')
        .update({ full_name: adminName })
        .eq('user_id', userId)
    }

    // 2. Add Role mapping
    // Delete existing roles for this club/user combo to prevent duplicates if changing
    const roleQuery = supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', appRole);

    if (targetClubId) {
      roleQuery.eq('club_id', targetClubId);
    } else {
      roleQuery.is('club_id', null);
    }
    await roleQuery;

    // Insert new role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: userId,
        club_id: targetClubId,
        role: appRole,
      })

    if (roleError) {
      console.error('Error creating user role:', roleError)
      return new Response(
        JSON.stringify({ error: roleError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Admin user created/updated successfully:', email)

    return new Response(
      JSON.stringify({ success: true, message: 'Admin user created successfully', user_id: userId }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    console.error('Error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})