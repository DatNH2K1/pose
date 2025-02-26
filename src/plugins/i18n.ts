import Helper from "@/plugins/helper.ts";
import {createI18n} from "vue-i18n";
import en from '@/lang/en.json';
import ja from '@/lang/ja.json';
import vi from '@/lang/vi.json';

const messages = { en, ja, vi };

const i18n = createI18n({
    legacy: false,
    locale: Helper.getLocale() as string,
    messages: messages,
    fallbackLocale: 'en'
})

export default i18n;