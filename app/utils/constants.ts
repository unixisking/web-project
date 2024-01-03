import { HomeIcon, UserGroupIcon } from "@heroicons/react/24/outline"

export const dropDownLinks = [
    {
        name: "Logout",
        href: "logout"
    }
]

export const links = [
    { name: 'Home', href: '/dashboard', icon: HomeIcon, admin: false },
    { name: 'Concepts', href: '/dashboard/concepts', icon: UserGroupIcon, admin: false },
    { name: 'Users', href: '/dashboard/users', icon: UserGroupIcon, admin: true },
    // { name: "Settings", href: "/dashboard/settings", icon: AdjustmentsHorizontalIcon }
]

// Example of 4 languages
export const languages = [
    {
        code: "es",
        name: "Spanish",
        nativeName: "español"

    },
    {
        code: "en_US",
        name: "English (US)",
        nativeName: "English"
    },
    {
        code: "de",
        name: "German",
        nativeName: "Deutsch"
    },
    {
        code: "fr",
        name: "French",
        nativeName: "Français"
    }
]

export const concepts = [
    {
        name: 'Brain composition',
        slug: 'brian-composition',
        filename: "brain-composition.jpeg",
        domain: 'Biology',
        description: "Each brain hemisphere (parts of the cerebrum) has four sections, called lobes: frontal, parietal, temporal and occipital. Each lobe controls specific functions.",
        languageId: 2,
        original: true,
        components: ["Frontal lobe.", "Parietal lobe.", "Occipital lobe.", "Temporal lobe."],
        translations: [{
            name: "Composition du cerveau",
            filename: "brain-composition.jpeg",
            original: false,
            description: "Chaque hémisphère cérébral (partie du cerveau) comprend quatre sections, appelées lobes : frontal, pariétal, temporal et occipital. Chaque lobe contrôle des fonctions spécifiques.",
            lang: "fr",
            components: ["Lobe frontal.", "Lobe pariétal.", "Lobe occipital.", "Lobe temporal."]
        }]
    },
    {
        name: 'Meninges layers',
        slug: "meninges-layers",
        filename: "meninges.jpeg",
        domain: 'Biology',
        description: "Three layers of protective covering called meninges surround the brain and the spinal cord.",
        lang: 'en_US',
        original: true,
        components: ["Dura mater", "Arachnoid", "Pia mater"],
        translations: [{
            name: "Couches de méninges",
            filename: "meninges.jpeg",
            original: false,
            description: "Trois couches de protection appelées méninges entourent le cerveau et la moelle épinière.",
            lang: "fr",
            components: ["Dura mater", "Arachnoïde", "Pia mater"]
        }]

    },
]

export const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Concepts', href: '#concepts' },
]