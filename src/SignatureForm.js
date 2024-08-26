// src/SignatureForm.js
import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SignatureForm = () => {
  const [name, setName] = useState('');
  const [signature, setSignature] = useState('');
  const signatureRef = useRef(null);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSaveSignature = () => {
    if (signatureRef.current) {
      const signatureData = signatureRef.current.toDataURL('image/png');
      setSignature(signatureData);
    }
  };

  const handleClearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setSignature('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !signature) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, signature }),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar os dados');
      }

      alert('Dados salvos com sucesso!');
      setName('');
      handleClearSignature();
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
      alert('Erro ao salvar os dados.');
    }
  };

  return (
    <div className="signature-form-container">
      <h1>Formulário de Assinatura</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            required
          />
        </div>

        <div>
          <label htmlFor="signature">Assinatura:</label>
          <SignatureCanvas
            ref={signatureRef}
            backgroundColor="white"
            penColor="black"
            canvasProps={{ width: 500, height: 200, className: 'signature-canvas' }}
          />
          <button type="button" onClick={handleSaveSignature}>
            Salvar Assinatura
          </button>
          <button type="button" onClick={handleClearSignature}>
            Limpar Assinatura
          </button>
        </div>

        <button type="submit">Enviar</button>
      </form>
      {signature && (
        <div>
          <h2>Pré-visualização da Assinatura:</h2>
          <img src={signature} alt="Assinatura" />
        </div>
      )}
    </div>
  );
};

export default SignatureForm;
