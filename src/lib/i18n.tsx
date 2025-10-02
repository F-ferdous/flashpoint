"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "bn" | "en";

// Minimal translation registry
const translations = {
  bn: {
    common: {
      brand_title: "Flash Point",
      logout: "লগ আউট",
      login: "লগ ইন",
      get_started: "শুরু করুন",
      pricing: "মূল্য",
      contact: "যোগাযোগ",
      points: "পয়েন্টস",
      earning: "আর্নিং",
      telemedicine: "টেলিমেডিসিন",
      switch_to_light: "লাইট মোডে যান",
      switch_to_dark: "ডার্ক মোডে যান",
      language: "ভাষা",
      bn: "বাংলা",
      en: "English",
      and: "ও",
    },
    dash: {
      common: {
        back_to_site: "সাইটে ফিরে যান",
        loading_admin: "অ্যাডমিন লোড হচ্ছে...",
        loading_dashboard: "ড্যাশবোর্ড লোড হচ্ছে...",
        recent_activity: "সাম্প্রতিক কার্যকলাপ",
        view_all: "সব দেখুন",
        live: "লাইভ",
        export: "এক্সপোর্ট",
        logout: "লগ আউট",
        signed_out: "সাইন আউট হয়েছে",
        sign_out_failed: "সাইন আউট ব্যর্থ",
        admin_badge: "অ্যাডমিন",
        agent_badge: "এজেন্ট",
        user_badge: "ইউজার",
        customer_badge: "কাস্টমার",
      },
      admin: {
        nav: {
          dashboard: "ড্যাশবোর্ড",
          agents: "এজেন্টস",
          customer: "কাস্টমার",
          verify: "ভেরিফাই",
          transfer: "ট্রান্সফার",
          wallet: "ওয়ালেট",
          payouts: "পেআউটস",
        },
        header_title: "ড্যাশবোর্ড",
        header_sub: "আজকের কার্যকলাপ ও প্ল্যাটফর্ম পরিসংখ্যানের সারসংক্ষেপ।",
        stats: {
          active_agents: "সক্রিয় এজেন্ট",
          wallet_balance: "ওয়ালেট ব্যালেন্স",
          transfers_today: "আজকের ট্রান্সফার",
          verifications: "ভেরিফিকেশনস",
          dashboard_stats_label: "ড্যাশবোর্ড পরিসংখ্যান",
        },
      },
      agent: {
        nav: {
          customers: "কাস্টমারস",
          referals: "রেফারালস",
          earnings: "আর্নিংস",
          transfer: "ট্রান্সফার",
          profile: "প্রোফাইল",
        },
        header_title: "এজেন্ট ড্যাশবোর্ড",
        header_sub: "আপনার কার্যকলাপ ও আয়ের দ্রুত সারসংক্ষেপ।",
        stats: {
          customers: "কাস্টমারস",
          verifications: "ভেরিফিকেশনস",
          referals: "রেফারালস",
          earnings: "আর্নিংস",
        },
      },
      user: {
        nav: {
          earnings: "আর্নিংস",
          referals: "রেফারালস",
          earn_online: "অনলাইনে আয়",
          wallet: "ওয়ালেট",
          telemedicine: "টেলিমেডিসিন",
          profile: "প্রোফাইল",
        },
        header_title: "ইউজার ড্যাশবোর্ড",
        header_sub: "আপনার আয় ও সার্ভিসগুলোর সারসংক্ষেপ।",
        profile: {
          title: "প্রোফাইল",
          subtitle: "আপনার তথ্য দেখুন ও হালনাগাদ করুন।",
          photo: "প্রোফাইল ছবি",
          change_photo: "ছবি পরিবর্তন",
          remove_photo: "ছবি মুছুন",
          email: "ইমেইল",
          name: "নাম",
          phone: "ফোন",
          district: "জেলা",
          address: "ঠিকানা",
          save: "পরিবর্তন সংরক্ষণ করুন",
          saving: "সংরক্ষণ হচ্ছে...",
          uploading: "আপলোড হচ্ছে... {pct}%",
          updated: "প্রোফাইল আপডেট হয়েছে",
          update_failed: "আপডেট ব্যর্থ হয়েছে",
        },
      },
      customer: {
        header_title: "কাস্টমার ড্যাশবোর্ড",
        header_sub: "স্বাগতম ফিরে। এখানে আপনার অ্যাকাউন্টের সারসংক্ষেপ।",
        badge_profile: "প্রোফাইল",
        edit: "এডিট",
        wallet_balance: "ওয়ালেট ব্যালেন্স",
        active_subs: "সক্রিয় সাবস্ক্রিপশন",
        points: "পয়েন্টস",
        recent_activity: "সাম্প্রতিক কার্যকলাপ",
        view_all: "সব দেখুন",
        debit: "ডেবিট",
        credit: "ক্রেডিট",
      },
    },
    navbar: {
      aria_home: "ফ্ল্যাশ পয়েন্ট হোম",
      logout: "লগ আউট",
      login: "লগ ইন",
      get_started: "শুরু করুন",
      open_menu: "প্রধান মেনু খুলুন",
    },
    hero: {
      badge: "স্মার্ট সার্ভিসের ভবিষ্যতে যোগ দিন",
      h1_p1: "রিওয়ার্ড আনলক করুন, নেটওয়ার্ক বাড়ান ও সার্ভিস নিন ",
      h1_highlight: "— সব এক প্ল্যাটফর্মে",
      h1_p2: " সহজেই!",
      desc:
        "পরবর্তী প্রজন্মের গেমিফিকেশন ও সার্ভিস ইকোসিস্টেম যেখানে অ্যাডমিন, এজেন্ট, সেলার ও কাস্টমাররা পয়েন্ট, রেফারাল ও আয়ের মাধ্যমে যুক্ত থাকে। ইন্টারেক্টিভ ড্যাশবোর্ড, নিরবচ্ছিন্ন লেনদেন ও ইন্টিগ্রেটেড টেলিমেডিসিন — যেকোনো সময়, যেকোনো জায়গা থেকে।",
      cta_get_started: "শুরু করুন",
      cta_view_pricing: "মূল্য দেখুন",
      chip_live_points: "লাইভ পয়েন্টস",
      chip_daily_bonus: "দৈনিক বোনাস",
      chip_referrals: "রেফারাল",
      chip_telemedicine: "টেলিমেডিসিন",
    },
    thirdParty: {
      badge: "থার্ড-পার্টি অফারে আয় করুন",
      title: "কীভাবে আয় করবেন ",
      title_highlight: "ধাপে ধাপে",
      subtitle:
        "অ্যাকাউন্ট তৈরি করুন, অফারে অংশ নিন এবং আপনার ড্যাশবোর্ড থেকেই পয়েন্ট সংগ্রহ করুন।",
      step1_title: "অ্যাকাউন্ট তৈরি করুন",
      step1_desc: "সাইন আপ করে প্রোফাইল ভেরিফাই করুন এবং আয়ের ড্যাশবোর্ডে প্রবেশ করুন।",
      step2_title: "বিজ্ঞাপন দেখুন",
      step2_desc: "স্বল্প সময়ের বিজ্ঞাপন দেখে সাথে সাথে পয়েন্ট অর্জন করুন।",
      step3_title: "অ্যাপ ইনস্টল করুন",
      step3_desc: "ড্যাশবোর্ড থেকে অফার বেছে নিন, অ্যাপ ইনস্টল করুন এবং কাজ সম্পন্ন করুন।",
      step4_title: "পয়েন্ট আয় করুন",
      step4_desc: "সব কার্যকলাপ থেকে পয়েন্ট জমা হবে। যেকোনো সময় রিডিম বা কনভার্ট করুন।",
      step_label: "ধাপ {n}",
    },
    telemedicine: {
      badge: "ভার্চুয়াল কেয়ার",
      title: "ইন-বিল্ট টেলিমেডিসিন",
      subtitle: "এক জায়গায় নিরাপদ কনসালটেশন, প্রেসক্রিপশন ও রেকর্ড।",
      c1_title: "অন-ডিমান্ড কনসালটেশন",
      c1_desc:
        "লাইসেন্সপ্রাপ্ত প্রোভাইডারের সাথে ভিডিও বা চ্যাট ভিজিট বুক করুন। ট্রায়াজ ও অপেক্ষা সময় নির্দেশক সহ।",
      c2_title: "ই-প্রেসক্রিপশন",
      c2_desc:
        "ফার্মেসি ইন্টিগ্রেশনসহ প্রোভাইডার-ইস্যুকৃত প্রেসক্রিপশন ও রিফিল রিমাইন্ডার।",
      c3_title: "রিপোর্টস ও ইতিহাস",
      c3_desc:
        "ল্যাব, ভিজিট নোট ও ইনভয়েস সংরক্ষণ করুন। রোল-ভিত্তিক অ্যাক্সেসে নিরাপদে শেয়ার করুন।",
    },
    points: {
      badge: "পয়েন্টস ও মুদ্রা",
      title: "পয়েন্টস ও মুদ্রা কনভার্শন",
      desc: "সহজে পয়েন্ট সংগ্রহ করুন এবং নিয়ম মেনে ফিয়াটে রূপান্তর করুন।",
      link: "কনভার্শন রেট দেখুন",
      c1_title: "পয়েন্ট সংগ্রহ ও ট্রান্সফার",
      c1_desc:
        "ডিপোজিট, উইথড্র ও ট্রান্সফার করুন ওটিপি ও লিমিট সহ। এজেন্টদের জন্য রোল-ভিত্তিক নিয়ন্ত্রণ।",
      c2_title: "মুদ্রায় রূপান্তর",
      c2_desc:
        "ফি সহ ইনস্ট্যান্ট কোট। মিন/ম্যাক্স সেট করুন, কেওয়াইসি চেক ও নিরাপদ পেআউট।",
      c3_title: "মুদ্রা দিয়ে পয়েন্ট কিনুন",
      c3_desc:
        "কার্ড, ব্যাংক বা এজেন্টের মাধ্যমে টপ-আপ করুন। অটো-রসিদ ও ডিসপিউট ওয়ার্কফ্লো অন্তর্ভুক্ত।",
    },
    contact: {
      heading_p1: "যোগাযোগ করতে ",
      heading_highlight: "প্রস্তুত",
      heading_p2: "?",
      note: "এখনও কোনো লিংক যুক্ত হয়নি — এটি শুধুমাত্র UI ল্যান্ডিং পেজ।",
      cta: "ওয়েটলিস্টে যোগ দিন",
    },
    login: {
      badge: "আবার স্বাগতম",
      heading: "লগ ইন করুন ",
      sub: "রিওয়ার্ডস ও সার্ভিস ম্যানেজ করতে আপনার ড্যাশবোর্ডে প্রবেশ করুন।",
      email_label: "ইমেইল",
      email_placeholder: "jane@example.com",
      pass_label: "পাসওয়ার্ড",
      pass_placeholder: "••••••••",
      forgot: "ভুলে গেছেন?",
      submit: "সাইন ইন",
      submitting: "সাইন ইন হচ্ছে...",
      new_here: "নতুন ব্যবহারকারী?",
      create_account: "অ্যাকাউন্ট তৈরি করুন",
      err_missing: "অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড দিন।",
      err_default: "সাইন ইন করা যাচ্ছে না। পরে আবার চেষ্টা করুন।",
      err_invalid: "ইমেইল বা পাসওয়ার্ড সঠিক নয়।",
      err_rate_limited: "অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।",
      err_network: "নেটওয়ার্ক সমস্যা। সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।",
      err_invalid_email: "সঠিক ইমেইল ঠিকানা দিন।",
    },
    signup: {
      loading: "লোড হচ্ছে…",
      badge: "অ্যাকাউন্ট তৈরি করুন",
      heading: "সাইন আপ করুন ",
      sub: "পয়েন্ট আয়, রিডিম ও টেলিমেডিসিন অ্যাক্সেস করতে যোগ দিন।",
      need_referral: "সাইন আপ করতে একটি বৈধ রেফারেল লিংক প্রয়োজন। অনুগ্রহ করে কোনো এজেন্টের কাছ থেকে ইনভাইট লিংক সংগ্রহ করুন।",
      full_name: "পূর্ণ নাম",
      full_name_ph: "Jane Doe",
      email: "ইমেইল",
      email_ph: "jane@example.com",
      phone: "ফোন নম্বর",
      phone_ph: "+8801XXXXXXXXX",
      district: "জেলা",
      district_select: "জেলা নির্বাচন করুন",
      districts: {
        dhaka: "ঢাকা",
        chattogram: "চট্টগ্রাম",
        rajshahi: "রাজশাহী",
        khulna: "খুলনা",
        barishal: "বরিশাল",
        sylhet: "সিলেট",
        rangpur: "রংপুর",
        mymensingh: "ময়মনসিংহ",
      },
      nid: "এনআইডি নম্বর",
      nid_ph: "XXXXXXXXXX",
      address: "ঠিকানা",
      address_ph: "বাড়ি, রোড, শহর, পোস্টকোড",
      upload_nid: "এনআইডি আপলোড (ঐচ্ছিক)",
      upload_supported: "সমর্থিত: JPG, PNG অথবা PDF।",
      terms: "চালিয়ে গেলে আপনি আমাদের ",
      terms_terms: "টার্মস",
      terms_privacy: "প্রাইভেসি পলিসি",
      creating: "তৈরি হচ্ছে...",
      create_account: "অ্যাকাউন্ট তৈরি করুন",
      thanks: "ধন্যবাদ! রেফারেলের মাধ্যমে আপনার সাইন আপ তথ্য গ্রহণ করা হয়েছে। একজন এজেন্ট আপনার অ্যাকাউন্ট সম্পন্ন করবেন।",
      already: "ইতিমধ্যে অ্যাকাউন্ট আছে?",
      login: "লগ ইন",
    },
    grocery: {
      title: "গ্রোসারি ও শপিং",
      desc: "সহজে গ্রোসারি অর্ডার ও ইন‑অ্যাপ শপিং ইন্টিগ্রেশনে পয়েন্ট আয় ও রিডিম করুন।",
      coming_soon: "শীঘ্রই আসছে",
    },
    footer: {
      product: "প্রোডাক্ট",
      company: "কোম্পানি",
      resources: "রিসোর্সেস",
      earning: "আর্নিং",
      points: "পয়েন্টস",
      telemedicine: "টেলিমেডিসিন",
      contact: "যোগাযোগ",
      about: "আমাদের সম্পর্কে",
      careers: "ক্যারিয়ার",
      blog: "ব্লগ",
      downloads: "ডাউনলোডস",
      docs: "ডকুমেন্টেশন",
      support: "সাপোর্ট",
      legal: "লিগ্যাল",
      privacy: "প্রাইভেসি পলিসি",
      terms: "টার্মস ও কন্ডিশনস",
      blurb1:
        "ফ্ল্যাশ পয়েন্ট একত্র করে রিওয়ার্ডস, পেমেন্টস ও কেয়ার। অফারে আয় করুন, নিশ্চিন্তে রিডিম করুন, এবং একই নিরাপদ প্ল্যাটফর্মে টেলিমেডিসিন নিন।",
      blurb2:
        "আধুনিক টিম ও কমিউনিটির জন্য— প্রাইভেসি-ফার্স্ট, স্কেলেবল ও ব্যবহারবান্ধব।",
      rights: "© {year} ফ্ল্যাশ পয়েন্ট। সর্বস্বত্ব সংরক্ষিত।",
      made_with: "ভালবাসা দিয়ে তৈরি — ডিজাইন-ফার্স্ট, প্রাইভেসি-ফরওয়ার্ড।",
    },
    coming: {
      badge: "শীঘ্রই আসছে",
      title: "এই ফিচারটি শীঘ্রই আসছে",
      desc: "আমরা এই সেকশনটি তৈরি করছি। খুব শিগগিরই এখানে দারুণ কিছু দেখতে পাবেন। ততক্ষণে হোমে ফিরে যান অথবা আমাদের সাথে যোগাযোগ করুন।",
      cta_home: "হোমে ফিরুন",
      cta_contact: "যোগাযোগ করুন",
    },
    legal: {
      privacy_title: "প্রাইভেসি পলিসি",
      privacy_desc:
        "আমরা আপনার ব্যক্তিগত তথ্যের সুরক্ষাকে সর্বোচ্চ গুরুত্ব দিই। সম্পূর্ণ নীতিমালা এখানে যুক্ত হবে।",
      terms_title: "টার্মস ও কন্ডিশনস",
      terms_desc: "আমাদের পরিষেবা ব্যবহারের শর্তাবলী এখানে যুক্ত হবে।",
    },
  },
  en: {
    common: {
      brand_title: "Flash Point",
      logout: "Logout",
      login: "Log In",
      get_started: "Get Started",
      pricing: "Pricing",
      contact: "Contact",
      points: "Points",
      earning: "Earning",
      telemedicine: "Telemedicine",
      switch_to_light: "Switch to light mode",
      switch_to_dark: "Switch to dark mode",
      language: "Language",
      bn: "Bangla",
      en: "English",
      and: "and",
    },
    navbar: {
      aria_home: "Flash Point Home",
      logout: "Logout",
      login: "Log In",
      get_started: "Get Started",
      open_menu: "Open main menu",
    },
    hero: {
      badge: "Join the Future of Smart Services",
      h1_p1: "Unlock Rewards, Grow Networks & Access Services ",
      h1_highlight: "– All in One Platform",
      h1_p2: " Effortlessly!",
      desc:
        "A next-gen gamification & service ecosystem where Admins, Agents, Sellers, and Customers connect through points, referrals, and earnings. Experience interactive dashboards, seamless transactions, and integrated telemedicine — anytime, anywhere.",
      cta_get_started: "Get Started",
      cta_view_pricing: "View Pricing",
      chip_live_points: "Live Points",
      chip_daily_bonus: "Daily Bonus",
      chip_referrals: "Referrals",
      chip_telemedicine: "Telemedicine",
    },
    thirdParty: {
      badge: "Earn with Third‑Party Offers",
      title: "How to Earn ",
      title_highlight: "step‑by‑step",
      subtitle:
        "Create your account, engage with offers, and collect points directly from your dashboard.",
      step1_title: "Create an Account",
      step1_desc: "Sign up and verify your profile to access your earning dashboard.",
      step2_title: "Watch Ads",
      step2_desc: "Complete short ad views to earn points instantly.",
      step3_title: "Install Apps",
      step3_desc: "Choose offers, install apps from your dashboard, and complete tasks.",
      step4_title: "Earn Points",
      step4_desc: "Points add up across all activities. Redeem or convert anytime.",
      step_label: "Step {n}",
    },
    telemedicine: {
      badge: "Virtual Care",
      title: "Telemedicine Built‑In",
      subtitle: "Secure virtual care with consultations, prescriptions, and records in one place.",
      c1_title: "On‑Demand Consults",
      c1_desc:
        "Book video or chat visits with licensed providers. Triage and wait‑time indicators.",
      c2_title: "E‑Prescriptions",
      c2_desc:
        "Provider‑issued prescriptions with pharmacy integrations and refill reminders.",
      c3_title: "Reports & History",
      c3_desc:
        "Store labs, visit notes, and invoices. Share securely with role‑based access.",
    },
    dash: {
      common: {
        back_to_site: "Back to site",
        loading_admin: "Loading admin...",
        loading_dashboard: "Loading dashboard...",
        recent_activity: "Recent Activity",
        view_all: "View All",
        live: "Live",
        export: "Export",
        logout: "Logout",
        signed_out: "Signed out",
        sign_out_failed: "Sign out failed",
        admin_badge: "Admin",
        agent_badge: "Agent",
        user_badge: "User",
        customer_badge: "Customer",
      },
      admin: {
        nav: {
          dashboard: "Dashboard",
          agents: "Agents",
          customer: "Customer",
          verify: "Verify",
          transfer: "Transfer",
          wallet: "Wallet",
          payouts: "Payouts",
        },
        header_title: "Dashboard",
        header_sub: "Summary of today’s activity and platform metrics.",
        stats: {
          active_agents: "Active Agents",
          wallet_balance: "Wallet Balance",
          transfers_today: "Transfers Today",
          verifications: "Verifications",
          dashboard_stats_label: "Dashboard Stats",
        },
      },
      agent: {
        nav: {
          customers: "Customers",
          referals: "Referrals",
          earnings: "Earnings",
          transfer: "Transfer",
          profile: "Profile",
        },
        header_title: "Agent Dashboard",
        header_sub: "Quick summary of your activity and earnings.",
        stats: {
          customers: "Customers",
          verifications: "Verifications",
          referals: "Referrals",
          earnings: "Earnings",
        },
      },
      user: {
        nav: {
          earnings: "Earnings",
          referals: "Referrals",
          earn_online: "Earn Online",
          wallet: "Wallet",
          telemedicine: "Telemedicine",
          profile: "Profile",
        },
        header_title: "User Dashboard",
        header_sub: "Summary of your earnings and services.",
        profile: {
          title: "Profile",
          subtitle: "View and update your information.",
          photo: "Profile Photo",
          change_photo: "Change Photo",
          remove_photo: "Remove Photo",
          email: "Email",
          name: "Name",
          phone: "Phone",
          district: "District",
          address: "Address",
          save: "Save Changes",
          saving: "Saving...",
          uploading: "Uploading... {pct}%",
          updated: "Profile updated",
          update_failed: "Update failed",
        },
      },
      customer: {
        header_title: "Customer Dashboard",
        header_sub: "Welcome back. Here’s an overview of your account.",
        badge_profile: "Profile",
        edit: "Edit",
        wallet_balance: "Wallet Balance",
        active_subs: "Active Subscriptions",
        points: "Points",
        recent_activity: "Recent Activity",
        view_all: "View All",
        debit: "Debit",
        credit: "Credit",
      },
    },
    points: {
      badge: "Points & Currency",
      title: "Points & Currency Conversion",
      desc: "Collect points seamlessly and convert to or from fiat with compliant rails.",
      link: "See conversion rates",
      c1_title: "Collect & Transfer Points",
      c1_desc:
        "Deposit, withdraw, and transfer with OTP and limits. Role-based controls for agents.",
      c2_title: "Convert to Currency",
      c2_desc:
        "Instant quotes with fees. Set min/max, KYC checks, and issue payouts securely.",
      c3_title: "Buy Points with Currency",
      c3_desc:
        "Top-up via cards, bank, or agents. Auto-receipts and dispute workflows included.",
    },
    contact: {
      heading_p1: "Ready to ",
      heading_highlight: "get in touch",
      heading_p2: "?",
      note: "No links wired yet — this is a UI-only landing page.",
      cta: "Join waitlist",
    },
    login: {
      badge: "Welcome back",
      heading: "Log in to ",
      sub: "Access your dashboard to manage rewards and services.",
      email_label: "Email",
      email_placeholder: "jane@example.com",
      pass_label: "Password",
      pass_placeholder: "••••••••",
      forgot: "Forgot?",
      submit: "Sign in",
      submitting: "Signing in...",
      new_here: "New here?",
      create_account: "Create an account",
      err_missing: "Please enter your email and password.",
      err_default: "Unable to sign in. Please try again.",
      err_invalid: "Invalid email or password.",
      err_rate_limited: "Too many attempts. Please try again later.",
      err_network: "Network error. Check your connection and try again.",
      err_invalid_email: "Please enter a valid email address.",
    },
    signup: {
      loading: "Loading…",
      badge: "Create your account",
      heading: "Sign up for ",
      sub: "Join to earn points, redeem, and access telemedicine securely.",
      need_referral: "A valid referral link is required to sign up. Please request an invite link from an agent.",
      full_name: "Full Name",
      full_name_ph: "Jane Doe",
      email: "Email",
      email_ph: "jane@example.com",
      phone: "Phone Number",
      phone_ph: "+8801XXXXXXXXX",
      district: "District",
      district_select: "Select district",
      districts: {
        dhaka: "Dhaka",
        chattogram: "Chattogram",
        rajshahi: "Rajshahi",
        khulna: "Khulna",
        barishal: "Barishal",
        sylhet: "Sylhet",
        rangpur: "Rangpur",
        mymensingh: "Mymensingh",
      },
      nid: "NID Number",
      nid_ph: "XXXXXXXXXX",
      address: "Address",
      address_ph: "House, Road, City, ZIP",
      upload_nid: "Upload NID (optional)",
      upload_supported: "Supported: JPG, PNG, or PDF.",
      terms: "By continuing you agree to our ",
      terms_terms: "Terms",
      terms_privacy: "Privacy Policy",
      creating: "Creating...",
      create_account: "Create account",
      thanks: "Thanks! Your sign up info has been captured via referral. An agent will finalize your account.",
      already: "Already have an account?",
      login: "Log in",
    },
    grocery: {
      title: "Grocery & Shopping",
      desc: "Convenient grocery orders and in-app shopping integrations to earn and redeem points.",
      coming_soon: "Coming Soon",
    },
    footer: {
      product: "Product",
      company: "Company",
      resources: "Resources",
      earning: "Earning",
      points: "Points",
      telemedicine: "Telemedicine",
      contact: "Contact",
      about: "About",
      careers: "Careers",
      blog: "Blog",
      downloads: "Downloads",
      docs: "Documentation",
      support: "Support",
      legal: "Legal",
      privacy: "Privacy Policy",
      terms: "Terms & Conditions",
      blurb1:
        "Flash Point unifies rewards, payments, and care. Earn through offers, redeem with confidence, and access telemedicine from a single, secure platform.",
      blurb2:
        "Built for modern teams and communities — privacy‑first, scalable, and delightful to use.",
      rights: "© {year} Flash Point. All rights reserved.",
      made_with: "Made with care — design-first, privacy-forward.",
    },
    coming: {
      badge: "Coming Soon",
      title: "This feature is coming soon",
      desc: "We’re building this section. You’ll find something delightful here very soon. In the meantime, return home or get in touch.",
      cta_home: "Back to Home",
      cta_contact: "Contact Us",
    },
  },
} as const;

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("bn"); // default Bangla

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang") as Lang | null;
      if (saved === "bn" || saved === "en") {
        setLangState(saved);
      } else {
        setLangState("bn");
      }
    } catch (_) {
      // no-op
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("lang", lang);
    } catch (_) {}
    // reflect to <html lang>
    try {
      document.documentElement.setAttribute("lang", lang === "bn" ? "bn" : "en");
    } catch (_) {}
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);

  const t = useCallback((key: string, vars?: Record<string, string | number>) => {
    const parts = key.split(".");
    let cur: any = translations[lang as Lang];
    for (const p of parts) {
      cur = cur?.[p];
    }
    let str = (typeof cur === "string" ? cur : key) as string;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return str;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}
