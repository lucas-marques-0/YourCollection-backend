const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const cors = require('cors');
require('dotenv/config');

const app = express();
const port = 3000

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota Cadastro
app.post('/registration', async (req, res) => {
    const { username, email, password, collections } = req.body
    const { data, error } = await supabase.auth.signUp({
        email: email, 
        password: password, 
        options: {
            data: {
                display_name: username,
                collections: collections
            }
        }
    })
    if(data) {
        res.json(data);
    }
    if(error) {
        res.status(500).send();
    }
});

// Rota Logar
app.post('/login', async (req, res) => {
    const { email, password } = req.body
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })
    if(data) {
        res.json(data);
    }
    if(error) {
        res.status(500).json({ message: error });
        //res.status(500).send();
    }
});                                                                                            

// Rota Deslogar
app.post('/signout', async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            res.status(500).json({ success: false, message: error });
        } else {
            res.json({ success: true, message: 'Logout bem-sucedido' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
});

// Rota verificar sessão
app.get('/verifySession', async (req, res) => {
    try {
        const { data, error } = await supabase.auth.getSession();
        if(data) {
            res.json(data);
        }
        if(error) {
            res.status(500).send();
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
});

// Rota buscar usuário
app.get('/getUser', async (req, res) => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if(user) {
            res.json(user);
        }
        if(error) {
            res.status(500).send();
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
});

// Rota adicionar coleção do usuário
app.put('/updateUserCollections', async (req, res) => {
    const { collections } = req.body;
    try {
        const { data, error } = await supabase.auth.updateUser({ data: { collections: collections } })
        if(data) {
            res.json(data);
        }
        if(error) {
            res.status(500).send();
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
});

app.listen(port, () => {
  console.log(`Servidor Express iniciado na porta ${port}`);
});
