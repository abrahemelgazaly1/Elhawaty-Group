import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      // Navigation
      "home": "الرئيسية",
      "about": "من نحن",
      "services": "خدماتنا",
      "contact": "اتصل بنا",
      
      // Hero Section
      "heroTitle": "الحوتي جروب",
      "heroSubtitle": "متجرك الشامل للهواتف والإكسسوارات والتحويلات المالية",
      "ourServices": "خدماتنا",
      "aboutUs": "من نحن",
      
      // Categories
      "newPhones": "هواتف جديدة",
      "usedPhones": "هواتف مستعملة",
      "accessories": "إكسسوارات",
      "laptops": "لابتوبات",
      "moneyMachine": "ماكينات عد الأموال",
      "transferMachine": "ماكينات التحويل",
      "bankingTransactions": "التحويلات البنكية",
      "electronicTransfer": "التحويل والدفع الإلكتروني",
      "smallPhones": "تليفونات صغيرة",
      
      // Filters
      "all": "الكل",
      "android": "أندرويد",
      "iphone": "آيفون",
      "new": "جديد",
      "used": "مستعمل",
      "electricity": "كهرباء",
      "covers": "جرابات",
      "watchesAirpods": "ساعات وإيربودز",
      
      // Product Details
      "quickOrder": "طلب سريع",
      "addToCart": "أضف للسلة",
      "buyNow": "اشتري الآن",
      "addToWishlist": "أضف للمفضلة",
      "description": "الوصف",
      "battery": "البطارية",
      "otherProducts": "منتجات أخرى",
      "count": "الكمية",
      
      // Forms
      "name": "الاسم",
      "phone1": "رقم الهاتف",
      "phone2": "رقم إضافي",
      "address": "العنوان",
      "serviceType": "نوع الخدمة",
      "deposit": "إيداع",
      "withdraw": "سحب",
      "bankType": "نوع البنك",
      "amount": "المبلغ",
      "sendRequest": "إرسال الطلب",
      
      // Transfer Forms
      "accountType": "نوع الحساب المراد التحويل منه",
      "instaPay": "إنستا باي",
      "vodafoneCash": "فودافون كاش",
      "instaPayUser": "يوزر إنستا باي",
      "senderAccount": "الحساب المرسل منه",
      "accountName": "اسم الحساب",
      "sentAmount": "المبلغ المرسل",
      "uploadScreenshot": "ارفق صورة السكرين شوت",
      "transferTo": "التحويل إلى",
      "walletOwnerName": "اسم صاحب المحفظة",
      "machineType": "نوع الماكينة",
      "fawry": "فوري",
      "aman": "أمان",
      "ahlyTamkeen": "الأهلي تمكين",
      "merchantNumber": "رقم التاجر أو كود الماكينة",
      
      // About Section
      "aboutDescription": "نحن متخصصون في التحويلات المالية والهواتف المحمولة والإكسسوارات. نقدم خدمات شاملة تشمل بيع الهواتف الجديدة والمستعملة، الإكسسوارات، اللابتوبات، ماكينات عد الأموال، وخدمات التحويلات المالية المختلفة. نحن مصدر ثقة لعملائنا ونضمن لهم أفضل الخدمات والأسعار.",
      "yearsExperience": "سنوات من الخبرة",
      "happyClients": "عميل راضي",
      "customerService": "خدمة العملاء",
      
      // Footer
      "trustSource": "مصدر ثقة",
      "guaranteeRights": "نضمن لك حقوقك",
      "aboutUsText": "نبذة عنا",
      "clientsCount": "عدد العملاء",
      "branches": "فروعنا",
      "contactPhone": "رقم التواصل",
      "storeLocation": "موقع المحل",
      "cairo": "القاهرة، مصر",
      "allRightsReserved": "جميع الحقوق محفوظة",
      
      // Category Page
      "loading": "جاري التحميل...",
      "discoverCollection": "اكتشف مجموعتنا المتميزة من",
      "noProducts": "لا توجد منتجات",
      "tryDifferentSearch": "جرب البحث بكلمات مختلفة أو غير الفلتر",
      "oneProduct": "منتج واحد",
      "products": "منتج",
      
      // Cart & Checkout
      "cart": "السلة",
      "emptyCart": "السلة فارغة",
      "noProductsInCart": "لا توجد منتجات في السلة",
      "backToShopping": "العودة للتسوق",
      "removeFromCart": "حذف من السلة",
      "quantity": "الكمية",
      "price": "السعر",
      "total": "الإجمالي",
      "checkout": "إتمام الطلب",
      "backToCart": "العودة للسلة",
      "orderSummary": "ملخص الطلب",
      "deliveryInfo": "بيانات التوصيل",
      "fullName": "الاسم الكامل",
      "phone1Label": "رقم الهاتف الأول",
      "phone2Label": "رقم الهاتف الثاني (اختياري)",
      "subtotal": "المجموع الفرعي",
      "deliveryFee": "رسوم التوصيل",
      "finalTotal": "الإجمالي",
      "confirmOrder": "تأكيد الطلب",
      "sending": "جاري الإرسال...",
      "secureTransaction": "معاملة آمنة - سيتم التواصل معك لتأكيد الطلب",
      "soldOut": "نفذت الكمية",
      "egp": "جنيه",
      "missingData": "بيانات ناقصة",
      "fillAllFields": "يرجى ملء جميع البيانات المطلوبة",
      "orderSent": "تم إرسال الطلب!",
      "orderSuccess": "تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً.",
      "error": "خطأ",
      "orderError": "حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.",
      "addedToWishlist": "تمت الإضافة!",
      "productAddedToWishlist": "تم إضافة المنتج إلى المفضلة ❤️",
      "alreadyInWishlist": "موجود بالفعل",
      "productAlreadyInWishlist": "المنتج موجود بالفعل في المفضلة",
      "enterFullName": "أدخل اسمك الكامل",
      "enterDetailedAddress": "أدخل عنوانك بالتفصيل",
      
      // Complaint Form
      "sendComplaint": "أرسل شكوى",
      "complaintDescription": "اكتب شكواك أو رأيك أو رسالتك هنا",
      "yourMessage": "رسالتك",
      "writeYourMessage": "اكتب شكواك أو رأيك أو رسالتك هنا",
      "sendNow": "أرسل الآن",
      "newComplaint": "شكوى/رسالة جديدة",
      "message": "الرسالة",
      "sentSuccessfully": "تم الإرسال بنجاح!",
      "thankYouForMessage": "شكراً لرسالتك. سيتم التواصل معك قريباً.",
      "errorSendingMessage": "حدث خطأ في إرسال الرسالة. حاول مرة أخرى.",
      "enterYourName": "أدخل اسمك",
      "phone": "رقم الهاتف",
      
      // Testimonials
      "customerReviews": "آراء عملائنا"
    }
  },
  en: {
    translation: {
      // Navigation
      "home": "Home",
      "about": "About Us",
      "services": "Services",
      "contact": "Contact",
      
      // Hero Section
      "heroTitle": "ELHAWTY GROUP",
      "heroSubtitle": "ELHAWTY GROUP for phones, accessories and financial transfers",
      "ourServices": "Our Services",
      "aboutUs": "About Us",
      
      // Categories
      "newPhones": "New Phones",
      "usedPhones": "Used Phones",
      "accessories": "Accessories",
      "laptops": "Laptops",
      "moneyMachine": "Money Counting Machines",
      "transferMachine": "Transfer Machines",
      "bankingTransactions": "Banking Transactions",
      "electronicTransfer": "Electronic Transfer & Payment",
      "smallPhones": "Small Phones",
      
      // Filters
      "all": "All",
      "android": "Android",
      "iphone": "iPhone",
      "new": "New",
      "used": "Used",
      "electricity": "Electricity",
      "covers": "Covers",
      "watchesAirpods": "Watches & AirPods",
      
      // Product Details
      "quickOrder": "Quick Order",
      "addToCart": "Add to Cart",
      "buyNow": "Buy Now",
      "addToWishlist": "Add to Wishlist",
      "description": "Description",
      "battery": "Battery",
      "otherProducts": "Other Products",
      "count": "Quantity",
      
      // Forms
      "name": "Name",
      "phone1": "Phone Number",
      "phone2": "Additional Number",
      "address": "Address",
      "serviceType": "Service Type",
      "deposit": "Deposit",
      "withdraw": "Withdraw",
      "bankType": "Bank Type",
      "amount": "Amount",
      "sendRequest": "Send Request",
      
      // Transfer Forms
      "accountType": "Account Type to Transfer From",
      "instaPay": "InstaPay",
      "vodafoneCash": "Vodafone Cash",
      "instaPayUser": "InstaPay User",
      "senderAccount": "Sender Account",
      "accountName": "Account Name",
      "sentAmount": "Sent Amount",
      "uploadScreenshot": "Upload Screenshot",
      "transferTo": "Transfer To",
      "walletOwnerName": "Wallet Owner Name",
      "machineType": "Machine Type",
      "fawry": "Fawry",
      "aman": "Aman",
      "ahlyTamkeen": "Ahly Tamkeen",
      "merchantNumber": "Merchant Number or Machine Code",
      
      // About Section
      "aboutDescription": "We specialize in financial transfers, mobile phones, and accessories. We provide comprehensive services including selling new and used phones, accessories, laptops, money counting machines, and various financial transfer services. We are a trusted source for our customers and guarantee them the best services and prices.",
      "yearsExperience": "Years of Experience",
      "happyClients": "Happy Clients",
      "customerService": "Customer Service",
      
      // Footer
      "trustSource": "Trust Source",
      "guaranteeRights": "We Guarantee Your Rights",
      "aboutUsText": "About Us",
      "clientsCount": "Clients Count",
      "branches": "Our Branches",
      "contactPhone": "Contact Phone",
      "storeLocation": "Store Location",
      "cairo": "Cairo, Egypt",
      "allRightsReserved": "All Rights Reserved",
      
      // Category Page
      "loading": "Loading...",
      "discoverCollection": "Discover our exclusive collection of",
      "noProducts": "No Products Found",
      "tryDifferentSearch": "Try different keywords or change the filter",
      "oneProduct": "One Product",
      "products": "Products",
      
      // Cart & Checkout
      "cart": "Cart",
      "emptyCart": "Cart is Empty",
      "noProductsInCart": "No products to purchase",
      "backToShopping": "Back to Shopping",
      "removeFromCart": "Remove from Cart",
      "quantity": "Quantity",
      "price": "Price",
      "total": "Total",
      "checkout": "Checkout",
      "backToCart": "Back to Cart",
      "orderSummary": "Order Summary",
      "deliveryInfo": "Delivery Information",
      "fullName": "Full Name",
      "phone1Label": "Phone Number 1",
      "phone2Label": "Phone Number 2 (Optional)",
      "subtotal": "Subtotal",
      "deliveryFee": "Delivery Fee",
      "finalTotal": "Total",
      "confirmOrder": "Confirm Order",
      "sending": "Sending...",
      "secureTransaction": "Secure Transaction - We will contact you to confirm the order",
      "soldOut": "Sold Out",
      "egp": "EGP",
      "missingData": "Missing Data",
      "fillAllFields": "Please fill in all required fields",
      "orderSent": "Order Sent!",
      "orderSuccess": "Your order has been sent successfully! We will contact you soon.",
      "error": "Error",
      "orderError": "An error occurred while sending the order. Please try again.",
      "addedToWishlist": "Added!",
      "productAddedToWishlist": "Product added to wishlist ❤️",
      "alreadyInWishlist": "Already Added",
      "productAlreadyInWishlist": "Product is already in wishlist",
      "enterFullName": "Enter your full name",
      "enterDetailedAddress": "Enter your detailed address",
      
      // Complaint Form
      "sendComplaint": "Send Complaint",
      "complaintDescription": "Write your complaint, opinion, or message here",
      "yourMessage": "Your Message",
      "writeYourMessage": "Write your complaint, opinion, or message here",
      "sendNow": "Send Now",
      "newComplaint": "New Complaint/Message",
      "message": "Message",
      "sentSuccessfully": "Sent Successfully!",
      "thankYouForMessage": "Thank you for your message. We will contact you soon.",
      "errorSendingMessage": "An error occurred while sending the message. Please try again.",
      "enterYourName": "Enter your name",
      "phone": "Phone Number",
      
      // Testimonials
      "customerReviews": "Customer Reviews"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;