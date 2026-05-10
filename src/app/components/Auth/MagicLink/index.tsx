"use client";
import { useState } from "react";
// import { signIn } from "next-auth/react"; // Removed - using custom auth
import toast from "react-hot-toast";
import { validateEmail } from "@/utils/validateEmail";

const handleSendMagicLink = async (email: string) => {
  try {
    const response = await fetch('/api/auth/magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    
    if (!response.ok) {
      throw new Error('Falha ao enviar link mágico')
    }
    
    toast.success('Link mágico enviado para seu email')
    return true
  } catch (error) {
    console.error(error)
    toast.error('Erro ao enviar link mágico')
    return false
  }
}

const MagicLink = () => {
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Por favor, insira seu email.");
    }

    setLoader(true);
    if (!validateEmail(email)) {
      setLoader(false);
      return toast.error("Por favor, insira um email válido.");
    } else {
      const success = await handleSendMagicLink(email)
      if (success) {
        setEmail("");
      }
      setLoader(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-[22px]">
        <input
          type="email"
          placeholder="Email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
          className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-hidden transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
        />
      </div>
      <div className="mb-9">
        <button
          type="submit"
          disabled={loader}
          className="flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-[#102C46] px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-[#102C46] disabled:opacity-50"
        >
          {loader ? 'Enviando...' : 'Enviar Link Mágico'}
        </button>
      </div>
    </form>
  );
};

export default MagicLink;
