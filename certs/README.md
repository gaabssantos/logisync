# Certificados extras (opcional)

Se a rede ou o antivírus da máquina inspeciona conexões HTTPS (por exemplo, o
"Web Shield" do Avast), o `npm ci` dentro dos containers falha com
`certificate verify failed`. Nesse caso, exporte o certificado raiz que o
Windows já confia para esta pasta, no formato PEM com extensão `.crt`.

Os Dockerfiles copiam esta pasta e usam os arquivos `.crt` apenas durante a
instalação das dependências (variável `NODE_EXTRA_CA_CERTS`). Em máquinas sem
esse tipo de inspeção, a pasta pode ficar só com este README.

Os arquivos `.crt` são específicos de cada máquina e não são versionados
(veja o `.gitignore`).
