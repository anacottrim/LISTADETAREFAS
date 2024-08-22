"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import Btn from '@/components/Btn';

const App = () => {
  const [tarefas, setTarefas] = useState<string[]>([]);
  const [novaTarefa, setNovaTarefa] = useState<string>("");
  const [tarefaEditada, setTarefaEditada] = useState<string>("");
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [aviso, setAviso] = useState<string>("");

  useEffect(() => {
    const fetchTarefas = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Erro ao buscar tarefas:", error);
      } else {
        setTarefas(data.map(task => task.title));
      }
    };

    fetchTarefas();
  }, []);

  const adicionarTarefa = async () => {
    if (novaTarefa.trim()) {
      if (tarefas.some(tarefa => tarefa.toLowerCase() === novaTarefa.toLowerCase())) {
        setAviso("Tarefa já existe!");
      } else {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('title', novaTarefa);

        if (error) {
          console.error("Erro ao verificar tarefa existente:", error);
        } else if (data.length > 0) {
          setAviso("Tarefa já existe!");
        } else {
          const { error: insertError } = await supabase
            .from('tasks')
            .insert([{ title: novaTarefa }]);

          if (insertError) {
            console.error("Erro ao adicionar tarefa:", insertError);
          } else {
            setTarefas([...tarefas, novaTarefa]);
            setNovaTarefa("");
            setAviso("");
          }
        }
      }
    }
  };

  const removerTarefa = async (index: number) => {
    const tarefaParaRemover = tarefas[index];

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('title', tarefaParaRemover);

    if (error) {
      console.error("Erro ao remover tarefa:", error);
    } else {
      const novasTarefas = [...tarefas];
      novasTarefas.splice(index, 1);
      setTarefas(novasTarefas);
    }
  };

  const iniciarEdicao = (index: number) => {
    setEditandoIndex(index);
    setTarefaEditada(tarefas[index]);
  };

  const cancelarEdicao = () => {
    setEditandoIndex(null);
    setTarefaEditada("");
    setAviso("");
  };

  const salvarEdicao = async () => {
    if (tarefaEditada.trim() && editandoIndex !== null) {
      if (tarefas.some((tarefa, index) => tarefa.toLowerCase() === tarefaEditada.toLowerCase() && index !== editandoIndex)) {
        setAviso("Tarefa já existe!");
      } else {
        const tarefaParaEditar = tarefas[editandoIndex];

        const { error } = await supabase
          .from('tasks')
          .update({ title: tarefaEditada })
          .eq('title', tarefaParaEditar);

        if (error) {
          console.error("Erro ao editar tarefa:", error);
        } else {
          const novasTarefas = [...tarefas];
          novasTarefas[editandoIndex] = tarefaEditada;
          setTarefas(novasTarefas);
          cancelarEdicao();
          setAviso("");
        }
      }
    }
  };

  const handleNovaTarefaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNovaTarefa(e.target.value);
    if (aviso) {
      setAviso("");
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Lista de Tarefas</h1>
      <div className="input-container">
        <input
          type="text"
          value={novaTarefa}
          onChange={handleNovaTarefaChange}
          className="task-input"
          placeholder="Digite uma nova tarefa..."
        />
        <Btn onClick={adicionarTarefa} className="add-button">Adicionar Tarefa</Btn>
      </div>
      
      {aviso && <p className="aviso">{aviso}</p>}

      {editandoIndex !== null && (
        <div className="edit-container">
          <input
            type="text"
            value={tarefaEditada}
            onChange={(e) => setTarefaEditada(e.target.value)}
            className="task-input"
            placeholder="Edite a tarefa..."
          />
          <Btn onClick={salvarEdicao} className="save-button">Salvar</Btn>
          <Btn onClick={cancelarEdicao} className="cancel-button">Cancelar</Btn>
        </div>
      )}
      
      <ul className="task-list">
        {tarefas.map((tarefa, index) => (
          <li key={index} className="task-item">
            {tarefa}
            <div className="button-group">
              <Btn onClick={() => iniciarEdicao(index)} className="edit-button">Editar</Btn>
              <Btn onClick={() => removerTarefa(index)} className="remove-button">Remover</Btn>
            </div>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .app-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Arial', sans-serif;
          background-color: #f7f9f9;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .app-title {
          text-align: center;
          margin-bottom: 24px;
          font-size: 28px;
        }

        .input-container, .edit-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .task-input {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          width: 100%;
          box-sizing: border-box;
        }

        .add-button, .save-button, .cancel-button, .edit-button, .remove-button {
          padding: 10px 15px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
        }

        .task-list {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }

        .task-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          margin-bottom: 10px;
          border-bottom: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .button-group {
          display: flex;
          gap: 8px;
        }

        .aviso {
          color: #dc3545;
          text-align: center;
          font-weight: bold;
          margin-bottom: 15px;
        }
      `}</style>
    </div>
  );
};

export default App;
