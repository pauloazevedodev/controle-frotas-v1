export const API_URL = 'http://localhost:8000/api/';

export function LOGIN(usuario, password) {
  const token = localStorage.getItem('token');
  return {
    url: API_URL + 'auth/login',
    options: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ usuario, password }),
    },
  };
}

export function GET_USUR() {
  const token = localStorage.getItem('token');
  return {
    url: API_URL + `get/usur`,
    options: {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  };
}

export function GET_VEICULOS(searchTerm) {
  const token = localStorage.getItem('token');
  console.log('oi');
  return {
    url: API_URL + `veiculos?search=${searchTerm}`,
    options: {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  };
}
export function GET_ROTAS(cod_veiculo) {
  const token = localStorage.getItem('token');
  return {
    url: API_URL + `get/rotas?cod_veiculo=${cod_veiculo}`,
    options: {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  };
}
export function CREATE_VEICULOS(data) {
  const token = localStorage.getItem('token');
  return {
    url: API_URL + 'insert/veiculos',
    options: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    },
  };
}
export function CREATE_ROTAS(data) {
  const token = localStorage.getItem('token');
  return {
    url: API_URL + 'insert/rotas',
    options: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    },
  };
}
export function EDIT_ROTAS(data) {
  const token = localStorage.getItem('token');
  return {
    url: API_URL + 'update/rotas',
    options: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    },
  };
}
export function DELETE_VEICULOS(data) {
  const token = localStorage.getItem('token');
  return {
    url: API_URL + 'delete/veiculos',
    options: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ placa: data.placa }),
    },
  };
}
export function EDIT_VEICULOS(data) {
  const token = localStorage.getItem('token');
  return {
    url: API_URL + 'edit/veiculos',
    options: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        numVeiculo: data.numVeiculo,
        placa: data.placa,
        modelo: data.modelo,
        ano: data.ano,
        capacidade: data.capacidade,
        dataProxManutencao: data.dataProxManutencao,
        dataUltManutencao: data.dataUltManutencao,
        empresa: data.empresa,
        motorista: data.motorista,
        tipoVeiculo: data.tipoVeiculo,
      }),
    },
  };
}
export function INSERT_ROTA(data) {
  const token = localStorage.getItem('token');
  return {
    url: API_URL + 'insert/rota',
    options: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        localPartida: data.localPartida,
        localChegada: data.localChegada,
      }),
    },
  };
}
export function CREATE_USUARIO(data) {
  const token = localStorage.getItem('token');
  return {
    url: API_URL + 'insert/usuario',
    options: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    },
  };
}
export function GET_USUARIOS(searchTerm) {
  const token = localStorage.getItem('token');
  const url = new URL(API_URL + 'usuarios');
  if (searchTerm) {
    url.searchParams.append('search', searchTerm);
  }
  return {
    url: url.toString(),
    options: {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  };
}
export function EDIT_USUARIO(data) {
  const token = localStorage.getItem('token');
  return {
    url: API_URL + 'edit/usuario',
    options: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        cpf: data.cpf,
        nome: data.nome,
        email: data.email,
        status: data.status,
        tipo: data.tipoUsuario,
        codUsur: data.codUsur,
      }),
    },
  };
}
export function DELETE_USUARIOS(data) {
  const token = localStorage.getItem('token');
  return {
    url: API_URL + 'delete/usuario',
    options: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ codUsur: data.cod_usuario }),
    },
  };
}
export function EDIT_STATUS_VEICULO(data, status) {
  const token = localStorage.getItem('token');
  return fetch(API_URL + 'edit/status/veiculo', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      placa: data.placa,
      status: status,
    }),
  });
}
export function GET_CEP(cep) {
  const token = localStorage.getItem('token');
  return {
    url: `${API_URL}busca/cep/${cep}`,
    options: {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  };
}

export function UPDATE_STATUS_ROTA(data, status, desc) {
  const token = localStorage.getItem('token');
  return {
    url: `${API_URL}edit/status/rota`,
    options: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        codRota: data.cod_rota,
        cod_veiculo: data.veiculo.cod_veiculo,
        status: status,
        desc: desc,
      }),
    },
  };
}
export function UPDATE_OBS_ROTA(data, desc) {
  const token = localStorage.getItem('token');
  return {
    url: `${API_URL}update/obs/rota`,
    options: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        cod_veiculo: data.veiculo.cod_veiculo,
        cod_rota: data.cod_rota,
        observacoesAdicionais: desc.observacoesAdicionais,
      }),
    },
  };
}
export function GET_OBS_ROTAS(cod_veiculo, cod_rota) {
  const token = localStorage.getItem('token');
  return {
    url:
      API_URL + `get/obs/rotas?cod_veiculo=${cod_veiculo}&cod_rota=${cod_rota}`,
    options: {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  };
}
export function GET_STATUS_ROTAS(cod_veiculo, cod_rota) {
  const token = localStorage.getItem('token');
  return {
    url:
      API_URL +
      `get/status/rotas?cod_veiculo=${cod_veiculo}&cod_rota=${cod_rota}`,
    options: {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  };
}
export function GET_RELATORIO_ROTAS(cod_veiculo) {
  const token = localStorage.getItem('token');
  return {
    url: API_URL + `get/relatorio/rotas?cod_veiculo=${cod_veiculo}`,
    options: {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  };
}

export function GET_MOTORISTAS() {
  const token = localStorage.getItem('token');
  return {
    url: API_URL + `get/motoristas`,
    options: {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  };
}
export function GET_VEICULOS_DISPONIVEIS() {
  const token = localStorage.getItem('token');
  return {
    url: API_URL + `get/veiculos/disponiveis`,
    options: {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  };
}
