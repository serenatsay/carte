export interface Translations {
  // Header
  retry: string;

  // Menu page
  translatedTo: string;
  translateTo: string;

  // Loading states
  analyzingMenu: string;
  thisWillTakeAMoment: string;
  initializingCamera: string;
  pointCameraAtMenu: string;

  // Buttons
  viewCart: string;
  cart: string;
  cartEmpty: string;
  pickForMe: string;
  getAIRecommendations: string;
  recommendForMe: string;
  addMoreItems: string;
  recommendMoreItems: string;
  generateOrder: string;
  generating: string;
  cancel: string;

  // Order Summary
  orderSummary: string;
  noItemsSelected: string;
  total: string;
  close: string;
  exitFullScreen: string;
  showToWaiter: string;

  // Pick for Me Modal
  pickForMeTitle: string;
  startWithEmptyCart: string;
  startWithEmptyCartDescription: string;
  partySize: string;
  howHungryAreYou: string;
  adventureLevel: string;
  safeChoices: string;
  adventurous: string;

  // Hunger levels
  lightBites: string;
  moderateMeal: string;
  fullMeal: string;
  letsFeast: string;

  // Camera
  cameraNotAvailable: string;
  cameraError: string;
  retrying: string;

  // Errors
  failedToParseMenu: string;
  failedToGeneratePickForMe: string;
}

export const translations: Record<string, Translations> = {
  English: {
    retry: "Retry",
    translatedTo: "Translated to",
    translateTo: "Translate to",
    analyzingMenu: "Analyzing menu...",
    thisWillTakeAMoment: "This may take a moment",
    initializingCamera: "Initializing camera...",
    pointCameraAtMenu: "Point camera at menu",
    viewCart: "View Cart",
    cart: "Cart",
    cartEmpty: "Cart (Empty)",
    pickForMe: "Pick for Me",
    getAIRecommendations: "Get AI Recommendations",
    recommendForMe: "Recommend for Me",
    addMoreItems: "Add More Items",
    recommendMoreItems: "Recommend More Items",
    generateOrder: "Generate Order",
    generating: "Generating...",
    cancel: "Cancel",
    orderSummary: "Order Summary",
    noItemsSelected: "No items selected.",
    total: "Total",
    close: "Close",
    exitFullScreen: "Exit Full Screen",
    showToWaiter: "Show to Waiter",
    pickForMeTitle: "Pick for Me",
    startWithEmptyCart: "Start with an empty cart?",
    startWithEmptyCartDescription: "We'll create a new order with recommendations. Toggle off to keep your existing order and add to it.",
    partySize: "Party Size",
    howHungryAreYou: "How hungry are you?",
    adventureLevel: "Adventure Level",
    safeChoices: "Safe choices - familiar dishes",
    adventurous: "Adventurous - local specialties & must-tries",
    lightBites: "Light bites",
    moderateMeal: "Moderate meal",
    fullMeal: "Full meal",
    letsFeast: "Let's feast!",
    cameraNotAvailable: "Camera not available. Use upload.",
    cameraError: "Camera error",
    retrying: "Retrying...",
    failedToParseMenu: "Failed to parse menu",
    failedToGeneratePickForMe: "Failed to generate order"
  },

  Spanish: {
    retry: "Reintentar",
    translatedTo: "Traducido a",
    translateTo: "Traducir a",
    analyzingMenu: "Analizando menú...",
    thisWillTakeAMoment: "Esto puede tomar un momento",
    initializingCamera: "Inicializando cámara...",
    pointCameraAtMenu: "Apunta la cámara al menú",
    viewCart: "Ver Carrito",
    cart: "Carrito",
    cartEmpty: "Carrito (Vacío)",
    pickForMe: "Elige por Mí",
    getAIRecommendations: "Obtener Recomendaciones IA",
    recommendForMe: "Recomienda para Mí",
    addMoreItems: "Agregar Más Artículos",
    recommendMoreItems: "Recomendar Más Artículos",
    generateOrder: "Generar Orden",
    generating: "Generando...",
    cancel: "Cancelar",
    orderSummary: "Resumen del Pedido",
    noItemsSelected: "No hay artículos seleccionados.",
    total: "Total",
    close: "Cerrar",
    exitFullScreen: "Salir de Pantalla Completa",
    showToWaiter: "Mostrar al Mesero",
    pickForMeTitle: "Elige por Mí",
    startWithEmptyCart: "¿Comenzar con carrito vacío?",
    startWithEmptyCartDescription: "Crearemos un nuevo pedido con recomendaciones. Desactiva para mantener tu pedido actual y agregar más.",
    partySize: "Tamaño del Grupo",
    howHungryAreYou: "¿Qué tan hambriento estás?",
    adventureLevel: "Nivel de Aventura",
    safeChoices: "Opciones seguras - platos familiares",
    adventurous: "Aventurero - especialidades locales y recomendados",
    lightBites: "Bocadillos ligeros",
    moderateMeal: "Comida moderada",
    fullMeal: "Comida completa",
    letsFeast: "¡A festejar!",
    cameraNotAvailable: "Cámara no disponible. Usa subir archivo.",
    cameraError: "Error de cámara",
    retrying: "Reintentando...",
    failedToParseMenu: "Error al analizar el menú",
    failedToGeneratePickForMe: "Error al generar orden"
  },

  French: {
    retry: "Réessayer",
    translatedTo: "Traduit en",
    translateTo: "Traduire en",
    analyzingMenu: "Analyse du menu...",
    thisWillTakeAMoment: "Cela peut prendre un moment",
    initializingCamera: "Initialisation de la caméra...",
    pointCameraAtMenu: "Pointez la caméra vers le menu",
    viewCart: "Voir Panier",
    cart: "Panier",
    cartEmpty: "Panier (Vide)",
    pickForMe: "Choisir pour Moi",
    getAIRecommendations: "Recommandations IA",
    recommendForMe: "Recommande pour Moi",
    addMoreItems: "Ajouter Plus d'Articles",
    recommendMoreItems: "Recommander Plus d'Articles",
    generateOrder: "Générer Commande",
    generating: "Génération...",
    cancel: "Annuler",
    orderSummary: "Résumé de Commande",
    noItemsSelected: "Aucun article sélectionné.",
    total: "Total",
    close: "Fermer",
    exitFullScreen: "Quitter Plein Écran",
    showToWaiter: "Montrer au Serveur",
    pickForMeTitle: "Choisir pour Moi",
    startWithEmptyCart: "Commencer avec un panier vide?",
    startWithEmptyCartDescription: "Nous créerons une nouvelle commande avec des recommandations. Désactivez pour garder votre commande actuelle et y ajouter.",
    partySize: "Taille du Groupe",
    howHungryAreYou: "À quel point avez-vous faim?",
    adventureLevel: "Niveau d'Aventure",
    safeChoices: "Choix sûrs - plats familiers",
    adventurous: "Aventureux - spécialités locales et incontournables",
    lightBites: "Collations légères",
    moderateMeal: "Repas modéré",
    fullMeal: "Repas complet",
    letsFeast: "Festoyons!",
    cameraNotAvailable: "Caméra non disponible. Utilisez le téléchargement.",
    cameraError: "Erreur de caméra",
    retrying: "Nouvelle tentative...",
    failedToParseMenu: "Échec de l'analyse du menu",
    failedToGeneratePickForMe: "Échec de la génération de commande"
  },

  "Chinese Traditional": {
    retry: "重試",
    translatedTo: "翻譯為",
    translateTo: "翻譯為",
    analyzingMenu: "分析菜單中...",
    thisWillTakeAMoment: "這可能需要一些時間",
    initializingCamera: "初始化相機中...",
    pointCameraAtMenu: "將相機對準菜單",
    viewCart: "查看購物車",
    cart: "購物車",
    cartEmpty: "購物車（空）",
    pickForMe: "為我選擇",
    getAIRecommendations: "獲取AI推薦",
    recommendForMe: "為我推薦",
    addMoreItems: "添加更多項目",
    recommendMoreItems: "推薦更多項目",
    generateOrder: "生成訂單",
    generating: "生成中...",
    cancel: "取消",
    orderSummary: "訂單摘要",
    noItemsSelected: "未選擇任何項目。",
    total: "總計",
    close: "關閉",
    exitFullScreen: "退出全屏",
    showToWaiter: "顯示給服務員",
    pickForMeTitle: "為我選擇",
    startWithEmptyCart: "從空購物車開始？",
    startWithEmptyCartDescription: "我們將創建一個帶有推薦的新訂單。關閉以保留您的現有訂單並添加。",
    partySize: "聚會人數",
    howHungryAreYou: "您有多餓？",
    adventureLevel: "冒險程度",
    safeChoices: "安全選擇 - 熟悉的菜餚",
    adventurous: "冒險 - 當地特色和必試",
    lightBites: "輕食",
    moderateMeal: "適量餐點",
    fullMeal: "完整餐點",
    letsFeast: "讓我們盛宴！",
    cameraNotAvailable: "相機不可用。使用上傳。",
    cameraError: "相機錯誤",
    retrying: "重試中...",
    failedToParseMenu: "解析菜單失敗",
    failedToGeneratePickForMe: "生成訂單失敗"
  },

  Russian: {
    retry: "Повторить",
    translatedTo: "Переведено на",
    translateTo: "Перевести на",
    analyzingMenu: "Анализ меню...",
    thisWillTakeAMoment: "Это может занять некоторое время",
    initializingCamera: "Инициализация камеры...",
    pointCameraAtMenu: "Наведите камеру на меню",
    viewCart: "Просмотр корзины",
    cart: "Корзина",
    cartEmpty: "Корзина (Пуста)",
    pickForMe: "Выбери за Меня",
    getAIRecommendations: "ИИ Рекомендации",
    recommendForMe: "Порекомендуй Мне",
    addMoreItems: "Добавить Ещё",
    recommendMoreItems: "Порекомендовать Ещё",
    generateOrder: "Создать заказ",
    generating: "Создание...",
    cancel: "Отмена",
    orderSummary: "Сводка заказа",
    noItemsSelected: "Товары не выбраны.",
    total: "Итого",
    close: "Закрыть",
    exitFullScreen: "Выйти из полноэкранного режима",
    showToWaiter: "Показать официанту",
    pickForMeTitle: "Выбери за Меня",
    startWithEmptyCart: "Начать с пустой корзины?",
    startWithEmptyCartDescription: "Мы создадим новый заказ с рекомендациями. Отключите, чтобы сохранить текущий заказ и добавить к нему.",
    partySize: "Размер компании",
    howHungryAreYou: "Насколько вы голодны?",
    adventureLevel: "Уровень приключений",
    safeChoices: "Безопасный выбор - знакомые блюда",
    adventurous: "Приключенческий - местные деликатесы и обязательное",
    lightBites: "Легкие закуски",
    moderateMeal: "Умеренная еда",
    fullMeal: "Полноценная еда",
    letsFeast: "Давайте пировать!",
    cameraNotAvailable: "Камера недоступна. Используйте загрузку.",
    cameraError: "Ошибка камеры",
    retrying: "Повторная попытка...",
    failedToParseMenu: "Не удалось проанализировать меню",
    failedToGeneratePickForMe: "Не удалось создать заказ"
  }
};

// Add more languages as needed
export const getTranslations = (language: string): Translations => {
  return translations[language] || translations.English;
};