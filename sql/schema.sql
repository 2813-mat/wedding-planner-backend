-- 1. Usuários (noivos, convidados logados, admins)
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    -- Use bcrypt/argon2
    full_name VARCHAR(150),
    role ENUM('noivo', 'convidado', 'admin') DEFAULT 'noivo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Casamentos
CREATE TABLE weddings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    wedding_date DATE NOT NULL,
    location VARCHAR(255),
    budget_total DECIMAL(12, 2) DEFAULT 0.00,
    couple_name_1 VARCHAR(100),
    couple_name_2 VARCHAR(100),
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Relacionamento N:N users ↔ weddings (permite múltiplos casamentos por user)
CREATE TABLE wedding_users (
    wedding_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    is_owner BOOLEAN DEFAULT FALSE,
    can_edit BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (wedding_id, user_id),
    FOREIGN KEY (wedding_id) REFERENCES weddings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Convidados (com link para user se logado)
CREATE TABLE guests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    wedding_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NULL,
    -- Link para usuário logado (ex.: convidado registra conta)
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(30),
    relation VARCHAR(50),
    group_name VARCHAR(100),
    plus_one BOOLEAN DEFAULT FALSE,
    confirmed TINYINT(1) DEFAULT NULL,
    -- NULL=pendente, 1=sim, 0=não
    adults INT DEFAULT 1,
    children INT DEFAULT 0,
    invitation_sent_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (wedding_id) REFERENCES weddings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE
    SET
        NULL
);

-- 4. Fornecedores
CREATE TABLE vendors (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    wedding_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    category ENUM(
        'buffet',
        'cerimonia',
        'decoracao',
        'fotografia',
        'musica',
        'bolo',
        'outros'
    ) NOT NULL,
    contact_name VARCHAR(100),
    phone VARCHAR(30),
    email VARCHAR(255),
    website VARCHAR(255),
    price DECIMAL(12, 2) DEFAULT 0.00,
    paid DECIMAL(12, 2) DEFAULT 0.00,
    status ENUM('cotando', 'contratado', 'pago', 'cancelado') DEFAULT 'cotando',
    notes TEXT,
    contract_date DATE,
    service_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (wedding_id) REFERENCES weddings(id) ON DELETE CASCADE
);

-- 5. Orçamento: Categorias
CREATE TABLE budget_categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    wedding_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL,
    allocated DECIMAL(12, 2) DEFAULT 0.00,
    spent DECIMAL(12, 2) DEFAULT 0.00,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (wedding_id) REFERENCES weddings(id) ON DELETE CASCADE
);

-- 5.1 Orçamento: Itens detalhados por categoria
CREATE TABLE budget_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    -- Ex.: "Aluguel de salão"
    allocated DECIMAL(12, 2) DEFAULT 0.00,
    spent DECIMAL(12, 2) DEFAULT 0.00,
    vendor_id BIGINT UNSIGNED NULL,
    -- Link opcional para fornecedor
    notes TEXT,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES budget_categories(id) ON DELETE CASCADE,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE
    SET
        NULL
);

-- 6. Checklist: Templates (itens fixos pré-definidos)
CREATE TABLE checklist_templates (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    due_offset INT DEFAULT 0,
    -- Dias antes do casamento (ex.: -90 para 3 meses antes)
    priority ENUM('alta', 'media', 'baixa') DEFAULT 'media' -- Adicione itens padrão aqui via INSERTs iniciais na migração
);

-- 6.1 Checklist: Itens por casamento (copiados do template)
CREATE TABLE checklist_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    wedding_id BIGINT UNSIGNED NOT NULL,
    template_id BIGINT UNSIGNED NULL,
    -- Referência ao template original
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    due_date DATE,
    completed_at TIMESTAMP NULL,
    priority ENUM('alta', 'media', 'baixa') DEFAULT 'media',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (wedding_id) REFERENCES weddings(id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES checklist_templates(id) ON DELETE
    SET
        NULL
);

-- 7. Lista de presentes: Itens
CREATE TABLE gifts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    wedding_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(12, 2),
    link VARCHAR(500),
    image_url VARCHAR(500),
    reserved_by BIGINT UNSIGNED NULL,
    -- Convidado que reservou
    purchased BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (wedding_id) REFERENCES weddings(id) ON DELETE CASCADE,
    FOREIGN KEY (reserved_by) REFERENCES guests(id) ON DELETE
    SET
        NULL
);

-- 7.1 Lista de presentes: Contribuições (doações em dinheiro)
CREATE TABLE gift_contributions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    wedding_id BIGINT UNSIGNED NOT NULL,
    guest_id BIGINT UNSIGNED NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    method ENUM('pix', 'cartao', 'dinheiro', 'outro') DEFAULT 'pix',
    receipt_url VARCHAR(500) NULL,
    -- Comprovante upload
    notes TEXT,
    contributed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wedding_id) REFERENCES weddings(id) ON DELETE CASCADE,
    FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE CASCADE
);

-- 8. Lua de mel
CREATE TABLE honeymoon (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    wedding_id BIGINT UNSIGNED NOT NULL UNIQUE,
    destination VARCHAR(150),
    departure_date DATE,
    return_date DATE,
    budget DECIMAL(12, 2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (wedding_id) REFERENCES weddings(id) ON DELETE CASCADE
);

-- 9. Arquivos de mídia (fotos, documentos, galeria)
CREATE TABLE media_files (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    wedding_id BIGINT UNSIGNED NOT NULL,
    -- Sempre linkado ao wedding
    entity_type ENUM(
        'wedding',
        'vendor',
        'gift',
        'budget_item',
        'checklist_item',
        'honeymoon'
    ) NOT NULL,
    entity_id BIGINT UNSIGNED NOT NULL,
    -- ID da entidade relacionada (polymorphic)
    file_name VARCHAR(255) NOT NULL,
    file_type ENUM('image', 'pdf', 'doc', 'other') NOT NULL,
    url VARCHAR(500) NOT NULL,
    -- URL no storage (ex.: S3, local)
    description TEXT,
    uploaded_by BIGINT UNSIGNED NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wedding_id) REFERENCES weddings(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_entity (entity_type, entity_id) -- Para buscas rápidas
);