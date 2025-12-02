import xlwt
from pathlib import Path

rows = [
    ["Nome","Produto","Valor","Quantidade","Data","Categoria","Status"],
    ["João Silva","Notebook Dell",4500.00,2,"2025-01-15","Eletrônicos","Aprovado"],
    ["Maria Santos","Mouse Logitech",150.00,5,"2025-01-16","Periféricos","Aprovado"],
    ["Pedro Costa","Teclado Mecânico",350.00,3,"2025-01-17","Periféricos","Pendente"],
    ["Ana Oliveira","Monitor LG",1200.00,4,"2025-01-18","Eletrônicos","Aprovado"],
    ["Carlos Souza","Webcam HD",280.00,6,"2025-01-19","Acessórios","Aprovado"],
    ["Juliana Lima","Headset Gamer",450.00,2,"2025-01-20","Acessórios","Cancelado"],
    ["Roberto Alves","SSD 1TB",650.00,8,"2025-01-21","Hardware","Aprovado"],
    ["Fernanda Reis","Cadeira Gamer",1800.00,1,"2025-01-22","Mobiliário","Aprovado"],
    ["Lucas Martins","Mesa Digitalizadora",980.00,2,"2025-01-23","Periféricos","Pendente"],
    ["Patricia Rocha","Impressora HP",850.00,3,"2025-01-24","Equipamentos","Aprovado"],
]

repo_root = Path(__file__).resolve().parent.parent
public_dir = repo_root / "Relatório com Interface Intuitiva" / "public"
public_dir.mkdir(parents=True, exist_ok=True)
output_path = public_dir / "Modelo_base.xls"

wb = xlwt.Workbook()
ws = wb.add_sheet('Modelo')

for r_idx, row in enumerate(rows):
    for c_idx, val in enumerate(row):
        if isinstance(val, float):
            ws.write(r_idx, c_idx, val)
        else:
            ws.write(r_idx, c_idx, str(val))

wb.save(str(output_path))
print(f"Wrote {output_path}")
