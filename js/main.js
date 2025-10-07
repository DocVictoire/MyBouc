// ---------------------------
// main.js - MyBouc
// ---------------------------

// ⚡ Initialisation Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://jqhkyfmanqtlwapsywbd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxaGt5Zm1hbnF0bHdhcHN5d2JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MzU4MjcsImV4cCI6MjA3NTQxMTgyN30.KhJ1YScGaBrwbxK41t8IaJk08gqAzJCz-IbOQSDf5jA';
const supabase = createClient(supabaseUrl, supabaseKey);

// ---------------------------
// Modal Connexion / Inscription
// ---------------------------
function showLoginModal() { document.getElementById('loginModal').style.display = 'block'; }
function closeLoginModal() { document.getElementById('loginModal').style.display = 'none'; }

// Formulaire Auth
const authForm = document.getElementById('authForm');
if(authForm){
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Inscription
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
    if(signUpError){
      document.getElementById('authMessage').innerText = signUpError.message;
      return;
    }

    document.getElementById('authMessage').innerText = 'Inscription réussie ! Vérifie ton email.';
  });
}

// Connexion
async function login(email, password){
  const { data, error } = await supabase.auth.signIn({ email, password });
  if(error) alert(error.message);
  else alert('Connexion réussie !');
}

// Déconnexion
async function logout(){
  const { error } = await supabase.auth.signOut();
  if(error) alert(error.message);
  else alert('Déconnexion réussie !');
}

// ---------------------------
// Récits
// ---------------------------
async function loadStories(){
  const { data, error } = await supabase.from('stories').select('*').order('created_at', { ascending: false });
  const storiesList = document.getElementById('storiesList');
  if(storiesList){
    storiesList.innerHTML = '';
    if(error){ storiesList.innerHTML = `<p>${error.message}</p>`; return; }
    data.forEach(s => {
      const div = document.createElement('div');
      div.innerHTML = `
        <h3>${s.title}</h3>
        <p>Type: ${s.type}</p>
        <button onclick="followStory('${s.id}')">Suivre</button>
        <button onclick="goToStory('${s.id}')">Lire</button>
      `;
      storiesList.appendChild(div);
    });
  }
}

// Charger un chapitre (exemple, page story.html)
async function loadChapter(storyId, chapterNumber=1){
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('story_id', storyId)
    .eq('chapter_number', chapterNumber)
    .single();

  const chapterContent = document.getElementById('chapterContent');
  const storyTitle = document.getElementById('storyTitle');
  if(chapterContent && storyTitle){
    if(error){ chapterContent.innerHTML = `<p>${error.message}</p>`; return; }
    storyTitle.innerText = data.title;
    chapterContent.innerHTML = `<p>${data.content}</p>`;
  }
}

// Navigation chapitres
let currentChapter = 1;
let currentStoryId = null;

function prevChapter(){
  if(currentChapter>1){ currentChapter--; loadChapter(currentStoryId, currentChapter); }
}
function nextChapter(){
  currentChapter++; loadChapter(currentStoryId, currentChapter);
}
function goToStory(storyId){
  currentStoryId = storyId;
  currentChapter = 1;
  window.location.href = 'story.html';
}

// ---------------------------
// Interludes
// ---------------------------
async function loadInterludes(){
  const { data, error } = await supabase.from('interludes').select('*').order('created_at', { ascending: false });
  const interludesList = document.getElementById('interludesList');
  if(interludesList){
    interludesList.innerHTML = '';
    if(error){ interludesList.innerHTML = `<p>${error.message}</p>`; return; }
    data.forEach(i => {
      const p = document.createElement('p');
      p.innerText = i.content;
      interludesList.appendChild(p);
    });
  }
}

// ---------------------------
// Favoris / Suivre récit
// ---------------------------
async function followStory(storyId){
  const user = supabase.auth.user();
  if(!user){ alert('Connectez-vous pour suivre un récit'); return; }

  const { data, error } = await supabase
    .from('favorites')
    .insert([{ user_id: user.id, story_id: storyId }]);

  if(error) alert('Erreur : ' + error.message);
  else alert('Récit ajouté à vos favoris !');
}

// ---------------------------
// Tableau de bord utilisateur
// ---------------------------
async function loadFollowedStories(){
  const user = supabase.auth.user();
  if(!user) return;

  const { data, error } = await supabase
    .from('favorites')
    .select('story_id, stories(title, type)')
    .eq('user_id', user.id);

  const followedDiv = document.getElementById('followedStories');
  if(followedDiv){
    followedDiv.innerHTML = '';
    if(error) followedDiv.innerHTML = `<p>${error.message}</p>`;
    else {
      data.forEach(f => {
        const div = document.createElement('div');
        div.innerHTML = `<p>${f.stories.title} (${f.stories.type})</p>`;
        followedDiv.appendChild(div);
      });
    }
  }
}

// ---------------------------
// Initialisation au chargement
// ---------------------------
document.addEventListener('DOMContentLoaded', () => {
  loadStories();
  loadInterludes();
  loadFollowedStories();
});
