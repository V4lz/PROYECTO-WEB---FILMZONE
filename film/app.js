
const API = '';
const token = () => localStorage.getItem('token');
const headers = () => ({ 'Content-Type': 'application/json', 'x-auth': token() || '' });

function youtubeEmbed(url){
  if(!url) return '';
  if(url.includes('/embed/')) return url;
  const id = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
  return `https://www.youtube.com/embed/${id}`;
}

function cerrarSesion(){
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  localStorage.removeItem('perfilActivo');
  window.location.href = 'index.html';
}
