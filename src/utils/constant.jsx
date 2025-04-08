import avatar from '../assets/avatar.jpg';

export const LOGO = "https://help.nflxext.com/helpcenter/OneTrust/oneTrust_production/consent/87b6a5c0-0104-4e96-a291-092c11350111/01938dc4-59b3-7bbc-b635-c4131030e85f/logos/dd6b162f-1a32-456a-9cfe-897231c7763c/4345ea78-053c-46d2-b11e-09adaef973dc/Netflix_Logo_PMS.png";

export const USER_AVATAR = (
  <img 
    src={avatar} 
    alt="User Avatar" 
    className="h-full w-full object-cover border-2 border-white"
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png';
    }}
  />
);
 
  export const API_OPTIONS = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: "Bearer " + import.meta.env.VITE_APP_TMDB_KEY
    },
  };

  export const IMG_CDN_URL = "https://image.tmdb.org/t/p/w500/"

  export const BG_URL = "https://assets.nflxext.com/ffe/siteui/vlv3/f6e7f6df-6973-46ef-b98f-12560d2b3c69/web/IN-en-20250317-TRIFECTA-perspective_26f87873-6014-460d-a6fb-1d96d85ffe5f_medium.jpg";

  export const Supported_Languages = [{identifier: "en", name: "English"}, 
    {identifier: "hindi", name: "Hindi"}, 
    {identifier: "spanish", name: "Spanish"}, 
    {identifier: "gujarati", name: "Gujarati"}]

   export const OpenAI_KEY = import.meta.env.VITE_APP_OpenAI_KEY;

   export const Firebase_API_Key = import.meta.env.VITE_FIREBASE_API_KEY;
