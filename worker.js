const CORE_URL = "https://pastebin.com/raw/pxcTMHZu"; 

export default {
  async fetch(req, env) {
    const u = new URL(req.url);
    
    // Генерация ключа
    if (u.pathname === "/gen") {
      const newKey = "ILY-" + Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
      await env.KEYSily.put(newKey, "active");
      return new Response(newKey);
    }

    // Проверка ключа
    const key = u.searchParams.get("key");
    if (key) {
      const valid = await env.KEYSily.get(key);
      if (!valid) return new Response("403 Invalid Key", { status: 403 });
      
      // УДАЛЯЕМ КЛЮЧ (он становится одноразовым)
      await env.KEYSily.delete(key); 
      
      const core = await fetch(CORE_URL).then(r => r.text());
      return new Response(core, { headers: { "content-type": "text/plain" } });
    }

    return new Response("ILY Key Server", { status: 200 });
  }
};
