
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Movie = require('./models/Movie');
const Series = require('./models/Series');

const mongo = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/filmzone';
const yt = id => `https://www.youtube.com/embed/${id}`;

const dataMovies = [
 ['El viaje de Chihiro','Una niña entra a un mundo de espíritus y debe ser valiente para salvar a sus papás.','2001-07-20','Fantasía',yt('5Fgq4Osh6XQ'),'https://www.mubis.es/media/articles/20975/223439/capturas-y-menus-de-el-viaje-de-chihiro-en-blu-ray-original.jpg'],
 ['Your Name','Dos jóvenes conectan de forma misteriosa mientras intercambian sus vidas.','2016-08-26','Romance',yt('xU47nhruN-Q'),'https://mty360.net/wp-content/uploads/2017/04/Your-Name-el-anime-ma%CC%81s-popular-de-todos-los-tiempos.jpg'],
 ['A Silent Voice','Un joven intenta reparar el daño que causó a una compañera de escuela.','2016-09-17','Drama',yt('nfK6UgLra7g'),'https://takanodan.net/assets/images/posts/14-knk/cover.jpg'],
 ['El castillo vagabundo','Sophie queda bajo un hechizo y se une al castillo de Howl para recuperar su vida.','2004-11-20','Fantasía',yt('iwROgK94zcM'),'https://www.ypl.org/sites/default/files/styles/large/public/2025-06/howl%27s%20moving%20castle%20flyer.jpg'],
 ['Suzume','Una chica viaja por Japón cerrando puertas misteriosas que amenazan al país.','2022-11-11','Aventura',yt('F7nQ0VUAOXg'),'https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=contain,format=auto,quality=85,width=1200,height=675/catalog/crunchyroll/1bccc008f7070a6d620fcd72d224d521.jpg'],
 ['La princesa Mononoke','Ashitaka queda atrapado en un conflicto entre humanos, naturaleza y espíritus.','1997-07-12','Fantasía',yt('4OiMOHRDs14'),'https://i.ytimg.com/vi/xhh8PzDnhiI/hq720.jpg'],
 ['Perfect Blue','Una idol cambia de carrera y empieza a perder el control entre fama, acoso y realidad.','1997-07-28','Suspenso',yt('BD8I4v9U4mw'),'https://m.media-amazon.com/images/S/pv-target-images/2ebfbdc62f343d95fc86003073e507c0d6766df98b66ca9bb0fc7ef91fccebb2.jpg'],
 ['Paprika','Una tecnología permite entrar a los sueños, pero todo se sale de control.','2006-11-25','Ciencia ficción',yt('yn7U1KIGeuQ'),'https://beam-images.warnermediacdn.com/BEAM_LWM_DELIVERABLES/b0d0f96d-e8a6-4b50-8409-85c07e3533f1/cf53a499-d2d2-474c-9c98-85f678c85a79?host=wbd-images.prod-vod.h264.io&partner=beamcom&w=500'],
 ['El niño y la garza','Un niño atraviesa un mundo fantástico mientras enfrenta pérdida y cambio.','2023-07-14','Fantasía',yt('t5khm-VjEu4'),'https://portalgeek.co/wp-content/uploads/2024/01/el-nino-y-la-garza.jpg'],
 ['El recuerdo de Marnie','Anna conoce a una chica misteriosa que la ayuda a entender su pasado.','2014-07-19','Drama',yt('jjmrxqcQdYg'),'https://m.media-amazon.com/images/I/71fxsHQyurL._AC_UF894,1000_QL80_.jpg']
];
const dataSeries = [
 ['Devilman Crybaby','Akira obtiene poderes demoníacos y queda en medio de una guerra brutal.','2018-01-05','Acción',yt('ww06yGPM7Kc'),'https://i0.wp.com/animebird.net/wp-content/uploads/2019/03/devilmancrybaby_review_01.jpg?fit=1200%2C675&ssl=1&w=640'],
 ['Jujutsu Kaisen','Yuji entra al mundo de los hechiceros para enfrentar maldiciones.','2020-10-03','Acción',yt('pkKu9hLT-t8'),'https://kenshoprezi.hu/wp-content/uploads/2024/02/Jujitsu-Kaisen-Header-1140x641.jpg'],
 ['Spy x Family','Un espía, una asesina y una niña telépata forman una familia falsa.','2022-04-09','Comedia',yt('ofXigq9aIpo'),'https://m.media-amazon.com/images/I/51yXlpkZvfL._AC_UF894,1000_QL80_.jpg'],
 ['Hunter x Hunter','Gon inicia un viaje para convertirse en hunter y encontrar a su papá.','2011-10-02','Aventura',yt('d6kBeJjTGnY'),'https://i.pinimg.com/736x/f1/cb/21/f1cb21a14a3bf3ad316cbbdd786a75d7.jpg'],
 ['Evangelion','Adolescentes pilotan robots gigantes mientras enfrentan amenazas y traumas.','1995-10-04','Ciencia ficción',yt('13nSISwxrY4'),'https://fanart.tv/api/download.php?type=download&image=175543&section=3'],
 ['The Seven Deadly Sins','Un grupo de caballeros legendarios intenta salvar un reino.','2014-10-05','Aventura',yt('wxcvbL6o55M'),'https://filmfilicos.com/wp-content/uploads/2018/06/portada.png'],
 ['Demon Slayer','Tanjiro busca salvar a su hermana y derrotar demonios.','2019-04-06','Acción',yt('VQGCKyvzIM4'),'https://themarckoguy.wordpress.com/wp-content/uploads/2021/12/kimetsunoyaibaseason1.jpg'],
 ['Chainsaw Man','Denji se convierte en cazador de demonios tras fusionarse con Pochita.','2022-10-12','Acción',yt('dFlDRhvM4L0'),'https://www.animationmagazine.net/wordpress/wp-content/uploads/Chainsaw-Man.jpg'],
 ['Madoka Magica','Chicas mágicas descubren el costo real de pedir deseos.','2011-01-07','Drama',yt('TFCz50qJpVA'),'https://pauladeveraescritora.com/wp-content/uploads/2020/07/622490237_orig.jpg'],
 ['Los diarios de la boticaria','Maomao usa su inteligencia para resolver misterios dentro del palacio.','2023-10-22','Misterio',yt('XYNGkSvFT8c'),'https://m.media-amazon.com/images/S/pv-target-images/6b2ed2f560a6dab29f28c13d177ee27d14f057f063e38d310eea0dcc3d595839.jpg']
];
async function main(){
 await mongoose.connect(mongo);
 await Promise.all([User.deleteMany(), Category.deleteMany(), Movie.deleteMany(), Series.deleteMany()]);
 const nombres = [...new Set([...dataMovies, ...dataSeries].map(x=>x[3]))];
 const cats = {};
 for (const nombre of nombres) cats[nombre] = await Category.create({nombre});
 await Movie.insertMany(dataMovies.map(x=>({titulo:x[0],descripcion:x[1],fecha_estreno:x[2],categoria:cats[x[3]]._id,url_trailer:x[4],imagen_portada:x[5]})));
 await Series.insertMany(dataSeries.map(x=>({titulo:x[0],descripcion:x[1],fecha_estreno:x[2],categoria:cats[x[3]]._id,url_trailer:x[4],imagen_portada:x[5]})));
 await User.create({nombre:'Admin Filmzone', email:'admin@filmzone.com', password: await bcrypt.hash('admin123',10), tipo_usuario:'admin', perfiles:['Admin']});
 await User.create({nombre:'Usuario Demo', email:'user@filmzone.com', password: await bcrypt.hash('user123',10), tipo_usuario:'user', perfiles:['Demo']});
 console.log('Base de datos precargada. Admin: admin@filmzone.com / admin123');
 await mongoose.disconnect();
}
main().catch(e=>{console.error(e); process.exit(1);});
