export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ja' | 'ko' | 'zh';

export interface Translations {
  [key: string]: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.movies': 'Movies',
    'nav.tvShows': 'TV Shows',
    'nav.genres': 'Genres',
    'nav.watchlist': 'My Watchlist',
    'nav.search': 'Search',
    
    // Common actions
    'action.play': 'Play',
    'action.watchNow': 'Watch Now',
    'action.moreInfo': 'More Info',
    'action.addToWatchlist': 'Add to Watchlist',
    'action.removeFromWatchlist': 'Remove from Watchlist',
    'action.share': 'Share',
    'action.rate': 'Rate',
    'action.trailer': 'Trailer',
    
    // Sections
    'section.trending': 'Trending',
    'section.popular': 'Popular',
    'section.topRated': 'Top Rated',
    'section.nowPlaying': 'Now Playing',
    'section.continueWatching': 'Continue Watching',
    'section.recentlyViewed': 'Recently Viewed',
    'section.recommendations': 'Recommended for You',
    
    // Search
    'search.placeholder': 'Search for movies, TV shows...',
    'search.noResults': 'No results found',
    'search.results': 'results found',
    
    // Watchlist
    'watchlist.empty': 'Your watchlist is empty',
    'watchlist.emptyDesc': 'Add movies and TV shows to your watchlist to keep track of what you want to watch.',
    
    // Player
    'player.selectProvider': 'Select Provider',
    'player.season': 'Season',
    'player.episode': 'Episode',
    
    // Time
    'time.min': 'min',
    'time.hour': 'h',
    'time.year': 'year',
    'time.years': 'years',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.movies': 'Películas',
    'nav.tvShows': 'Series',
    'nav.genres': 'Géneros',
    'nav.watchlist': 'Mi Lista',
    'nav.search': 'Buscar',
    
    'action.play': 'Reproducir',
    'action.watchNow': 'Ver Ahora',
    'action.moreInfo': 'Más Info',
    'action.addToWatchlist': 'Añadir a Mi Lista',
    'action.removeFromWatchlist': 'Quitar de Mi Lista',
    'action.share': 'Compartir',
    'action.rate': 'Calificar',
    'action.trailer': 'Tráiler',
    
    'section.trending': 'Tendencias',
    'section.popular': 'Popular',
    'section.topRated': 'Mejor Valoradas',
    'section.nowPlaying': 'En Cartelera',
    'section.continueWatching': 'Continuar Viendo',
    'section.recentlyViewed': 'Visto Recientemente',
    'section.recommendations': 'Recomendado para Ti',
    
    'search.placeholder': 'Buscar películas, series...',
    'search.noResults': 'No se encontraron resultados',
    'search.results': 'resultados encontrados',
    
    'watchlist.empty': 'Tu lista está vacía',
    'watchlist.emptyDesc': 'Añade películas y series a tu lista para hacer seguimiento de lo que quieres ver.',
    
    'player.selectProvider': 'Seleccionar Proveedor',
    'player.season': 'Temporada',
    'player.episode': 'Episodio',
    
    'time.min': 'min',
    'time.hour': 'h',
    'time.year': 'año',
    'time.years': 'años',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.movies': 'Films',
    'nav.tvShows': 'Séries',
    'nav.genres': 'Genres',
    'nav.watchlist': 'Ma Liste',
    'nav.search': 'Rechercher',
    
    'action.play': 'Lire',
    'action.watchNow': 'Regarder',
    'action.moreInfo': 'Plus d\'Info',
    'action.addToWatchlist': 'Ajouter à Ma Liste',
    'action.removeFromWatchlist': 'Retirer de Ma Liste',
    'action.share': 'Partager',
    'action.rate': 'Noter',
    'action.trailer': 'Bande-annonce',
    
    'section.trending': 'Tendances',
    'section.popular': 'Populaire',
    'section.topRated': 'Mieux Notés',
    'section.nowPlaying': 'À l\'Affiche',
    'section.continueWatching': 'Continuer à Regarder',
    'section.recentlyViewed': 'Vus Récemment',
    'section.recommendations': 'Recommandé pour Vous',
    
    'search.placeholder': 'Rechercher films, séries...',
    'search.noResults': 'Aucun résultat trouvé',
    'search.results': 'résultats trouvés',
    
    'watchlist.empty': 'Votre liste est vide',
    'watchlist.emptyDesc': 'Ajoutez des films et séries à votre liste pour suivre ce que vous voulez regarder.',
    
    'player.selectProvider': 'Sélectionner Fournisseur',
    'player.season': 'Saison',
    'player.episode': 'Épisode',
    
    'time.min': 'min',
    'time.hour': 'h',
    'time.year': 'an',
    'time.years': 'ans',
  },
  de: {
    'nav.home': 'Startseite',
    'nav.movies': 'Filme',
    'nav.tvShows': 'Serien',
    'nav.genres': 'Genres',
    'nav.watchlist': 'Meine Liste',
    'nav.search': 'Suchen',
    
    'action.play': 'Abspielen',
    'action.watchNow': 'Jetzt Ansehen',
    'action.moreInfo': 'Mehr Info',
    'action.addToWatchlist': 'Zur Liste Hinzufügen',
    'action.removeFromWatchlist': 'Von Liste Entfernen',
    'action.share': 'Teilen',
    'action.rate': 'Bewerten',
    'action.trailer': 'Trailer',
    
    'section.trending': 'Trending',
    'section.popular': 'Beliebt',
    'section.topRated': 'Top Bewertet',
    'section.nowPlaying': 'Aktuell im Kino',
    'section.continueWatching': 'Weiterschauen',
    'section.recentlyViewed': 'Kürzlich Angesehen',
    'section.recommendations': 'Für Sie Empfohlen',
    
    'search.placeholder': 'Filme, Serien suchen...',
    'search.noResults': 'Keine Ergebnisse gefunden',
    'search.results': 'Ergebnisse gefunden',
    
    'watchlist.empty': 'Ihre Liste ist leer',
    'watchlist.emptyDesc': 'Fügen Sie Filme und Serien zu Ihrer Liste hinzu, um zu verfolgen, was Sie sehen möchten.',
    
    'player.selectProvider': 'Anbieter Auswählen',
    'player.season': 'Staffel',
    'player.episode': 'Episode',
    
    'time.min': 'Min',
    'time.hour': 'Std',
    'time.year': 'Jahr',
    'time.years': 'Jahre',
  },
  it: {
    'nav.home': 'Home',
    'nav.movies': 'Film',
    'nav.tvShows': 'Serie TV',
    'nav.genres': 'Generi',
    'nav.watchlist': 'La Mia Lista',
    'nav.search': 'Cerca',
    
    'action.play': 'Riproduci',
    'action.watchNow': 'Guarda Ora',
    'action.moreInfo': 'Più Info',
    'action.addToWatchlist': 'Aggiungi alla Lista',
    'action.removeFromWatchlist': 'Rimuovi dalla Lista',
    'action.share': 'Condividi',
    'action.rate': 'Vota',
    'action.trailer': 'Trailer',
    
    'section.trending': 'Di Tendenza',
    'section.popular': 'Popolare',
    'section.topRated': 'Più Votati',
    'section.nowPlaying': 'Al Cinema',
    'section.continueWatching': 'Continua a Guardare',
    'section.recentlyViewed': 'Visti di Recente',
    'section.recommendations': 'Consigliati per Te',
    
    'search.placeholder': 'Cerca film, serie TV...',
    'search.noResults': 'Nessun risultato trovato',
    'search.results': 'risultati trovati',
    
    'watchlist.empty': 'La tua lista è vuota',
    'watchlist.emptyDesc': 'Aggiungi film e serie TV alla tua lista per tenere traccia di cosa vuoi guardare.',
    
    'player.selectProvider': 'Seleziona Provider',
    'player.season': 'Stagione',
    'player.episode': 'Episodio',
    
    'time.min': 'min',
    'time.hour': 'h',
    'time.year': 'anno',
    'time.years': 'anni',
  },
  pt: {
    'nav.home': 'Início',
    'nav.movies': 'Filmes',
    'nav.tvShows': 'Séries',
    'nav.genres': 'Gêneros',
    'nav.watchlist': 'Minha Lista',
    'nav.search': 'Buscar',
    
    'action.play': 'Reproduzir',
    'action.watchNow': 'Assistir Agora',
    'action.moreInfo': 'Mais Info',
    'action.addToWatchlist': 'Adicionar à Lista',
    'action.removeFromWatchlist': 'Remover da Lista',
    'action.share': 'Compartilhar',
    'action.rate': 'Avaliar',
    'action.trailer': 'Trailer',
    
    'section.trending': 'Em Alta',
    'section.popular': 'Popular',
    'section.topRated': 'Mais Avaliados',
    'section.nowPlaying': 'Em Cartaz',
    'section.continueWatching': 'Continuar Assistindo',
    'section.recentlyViewed': 'Vistos Recentemente',
    'section.recommendations': 'Recomendados para Você',
    
    'search.placeholder': 'Buscar filmes, séries...',
    'search.noResults': 'Nenhum resultado encontrado',
    'search.results': 'resultados encontrados',
    
    'watchlist.empty': 'Sua lista está vazia',
    'watchlist.emptyDesc': 'Adicione filmes e séries à sua lista para acompanhar o que você quer assistir.',
    
    'player.selectProvider': 'Selecionar Provedor',
    'player.season': 'Temporada',
    'player.episode': 'Episódio',
    
    'time.min': 'min',
    'time.hour': 'h',
    'time.year': 'ano',
    'time.years': 'anos',
  },
  ja: {
    'nav.home': 'ホーム',
    'nav.movies': '映画',
    'nav.tvShows': 'テレビ番組',
    'nav.genres': 'ジャンル',
    'nav.watchlist': 'マイリスト',
    'nav.search': '検索',
    
    'action.play': '再生',
    'action.watchNow': '今すぐ視聴',
    'action.moreInfo': '詳細情報',
    'action.addToWatchlist': 'リストに追加',
    'action.removeFromWatchlist': 'リストから削除',
    'action.share': '共有',
    'action.rate': '評価',
    'action.trailer': '予告編',
    
    'section.trending': 'トレンド',
    'section.popular': '人気',
    'section.topRated': '高評価',
    'section.nowPlaying': '上映中',
    'section.continueWatching': '続きを見る',
    'section.recentlyViewed': '最近見た',
    'section.recommendations': 'おすすめ',
    
    'search.placeholder': '映画、テレビ番組を検索...',
    'search.noResults': '結果が見つかりません',
    'search.results': '件の結果',
    
    'watchlist.empty': 'リストは空です',
    'watchlist.emptyDesc': '映画やテレビ番組をリストに追加して、視聴したいコンテンツを管理しましょう。',
    
    'player.selectProvider': 'プロバイダーを選択',
    'player.season': 'シーズン',
    'player.episode': 'エピソード',
    
    'time.min': '分',
    'time.hour': '時間',
    'time.year': '年',
    'time.years': '年',
  },
  ko: {
    'nav.home': '홈',
    'nav.movies': '영화',
    'nav.tvShows': 'TV 프로그램',
    'nav.genres': '장르',
    'nav.watchlist': '내 목록',
    'nav.search': '검색',
    
    'action.play': '재생',
    'action.watchNow': '지금 시청',
    'action.moreInfo': '더 보기',
    'action.addToWatchlist': '목록에 추가',
    'action.removeFromWatchlist': '목록에서 제거',
    'action.share': '공유',
    'action.rate': '평가',
    'action.trailer': '예고편',
    
    'section.trending': '인기 급상승',
    'section.popular': '인기',
    'section.topRated': '높은 평점',
    'section.nowPlaying': '현재 상영중',
    'section.continueWatching': '계속 시청하기',
    'section.recentlyViewed': '최근 본 콘텐츠',
    'section.recommendations': '추천',
    
    'search.placeholder': '영화, TV 프로그램 검색...',
    'search.noResults': '결과를 찾을 수 없습니다',
    'search.results': '개의 결과',
    
    'watchlist.empty': '목록이 비어있습니다',
    'watchlist.emptyDesc': '영화와 TV 프로그램을 목록에 추가하여 시청하고 싶은 콘텐츠를 관리하세요.',
    
    'player.selectProvider': '제공업체 선택',
    'player.season': '시즌',
    'player.episode': '에피소드',
    
    'time.min': '분',
    'time.hour': '시간',
    'time.year': '년',
    'time.years': '년',
  },
  zh: {
    'nav.home': '首页',
    'nav.movies': '电影',
    'nav.tvShows': '电视剧',
    'nav.genres': '类型',
    'nav.watchlist': '我的列表',
    'nav.search': '搜索',
    
    'action.play': '播放',
    'action.watchNow': '立即观看',
    'action.moreInfo': '更多信息',
    'action.addToWatchlist': '添加到列表',
    'action.removeFromWatchlist': '从列表中移除',
    'action.share': '分享',
    'action.rate': '评分',
    'action.trailer': '预告片',
    
    'section.trending': '热门',
    'section.popular': '流行',
    'section.topRated': '高评分',
    'section.nowPlaying': '正在上映',
    'section.continueWatching': '继续观看',
    'section.recentlyViewed': '最近观看',
    'section.recommendations': '为您推荐',
    
    'search.placeholder': '搜索电影、电视剧...',
    'search.noResults': '未找到结果',
    'search.results': '个结果',
    
    'watchlist.empty': '您的列表为空',
    'watchlist.emptyDesc': '将电影和电视剧添加到您的列表中，以跟踪您想观看的内容。',
    
    'player.selectProvider': '选择提供商',
    'player.season': '季',
    'player.episode': '集',
    
    'time.min': '分钟',
    'time.hour': '小时',
    'time.year': '年',
    'time.years': '年',
  }
};

// Get current language from localStorage or default to English
export const getCurrentLanguage = (): Language => {
  const saved = localStorage.getItem('language') as Language;
  return saved && translations[saved] ? saved : 'en';
};

// Set current language
export const setLanguage = (language: Language): void => {
  localStorage.setItem('language', language);
  window.dispatchEvent(new Event('languageChanged'));
};

// Get translation for a key
export const t = (key: string, fallback?: string): string => {
  const language = getCurrentLanguage();
  return translations[language]?.[key] || translations.en[key] || fallback || key;
};

// Get all available languages
export const getAvailableLanguages = (): { code: Language; name: string; flag: string }[] => [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];