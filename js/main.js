// Initialisation Supabase
const supabaseUrl = 'TON_SUPABASE_URL';
const supabaseKey = 'TON_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Modal login
function showLoginModal() { document.getElementById('loginModal').style.display = 'block'; }
function closeLoginModal() { document.getElementById('loginModal').style.display = 'none'; }

// Authentification
const authForm = document.getElementById('authForm');
if(authForm) {
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { data, error } = await supabase.auth.signUp({ email, password });
    if(error) { document.getElementById('authMessage').innerText = error.message; }
    else { document.getElementById('authMessage').innerText = 'Inscription réussie !'; }
  });
}

// Navigation chapitres (exemple)
function prevChapter() { alert('Chapitre précédent'); }
function nextChapter() { alert('Chapitre suivant'); }

// Liste statique récits pour tester
const storiesList = document.getElementById('storiesList');
if(storiesList){
  const stories = [
    { title: 'Récit 1', type: 'court' },
    { title: 'Récit 2', type: 'introspection' },
    { title: 'Récit 3', type: 'roman' }
  ];
  stories.forEach(s => {
    const div = document.createElement('div');
    div.innerHTML = `<h3>${s.title}</h3><p>Type: ${s.type}</p><button>Suivre</button>`;
    storiesList.appendChild(div);
  });
}

// Liste statique interludes
const interludesList = document.getElementById('interludesList');
if(interludesList){
  const interludes = [
    'Aphorisme 1',
    'Méditation 2',
    'Aphorisme 3'
  ];
  interludes.forEach(i => {
    const p = document.createElement('p');
    p.innerText = i;
    interludesList.appendChild(p);
  });
}
