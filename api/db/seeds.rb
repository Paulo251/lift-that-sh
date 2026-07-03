EXERCISES = [
  # Peito
  { name: "Supino Reto", primary_muscle_group: "chest", secondary_muscle_groups: %w[triceps shoulders], equipment: "barbell", category: "compound",
    description: "Deitado no banco reto, desça a barra até o peito e empurre de volta." },
  { name: "Supino Inclinado", primary_muscle_group: "chest", secondary_muscle_groups: %w[triceps shoulders], equipment: "barbell", category: "compound",
    description: "Supino em banco inclinado (30-45°), enfatiza a porção superior do peitoral." },
  { name: "Supino com Halteres", primary_muscle_group: "chest", secondary_muscle_groups: %w[triceps shoulders], equipment: "dumbbell", category: "compound",
    description: "Supino com halteres, maior amplitude e trabalho de estabilização." },
  { name: "Crucifixo", primary_muscle_group: "chest", secondary_muscle_groups: %w[shoulders], equipment: "dumbbell", category: "isolation",
    description: "Abertura de braços com halteres no banco, isolando o peitoral." },
  { name: "Crossover", primary_muscle_group: "chest", secondary_muscle_groups: [], equipment: "cable", category: "isolation",
    description: "Cruzamento de cabos na polia, tensão constante no peitoral." },
  { name: "Flexão de Braços", primary_muscle_group: "chest", secondary_muscle_groups: %w[triceps shoulders core], equipment: "bodyweight", category: "compound",
    description: "Flexão clássica no solo com o peso do corpo." },

  # Costas
  { name: "Levantamento Terra", primary_muscle_group: "back", secondary_muscle_groups: %w[legs glutes core forearms], equipment: "barbell", category: "compound",
    description: "Levante a barra do chão até a extensão total do quadril. O rei dos exercícios." },
  { name: "Remada Curvada", primary_muscle_group: "back", secondary_muscle_groups: %w[biceps forearms], equipment: "barbell", category: "compound",
    description: "Tronco inclinado, puxe a barra em direção ao abdômen." },
  { name: "Puxada Frontal", primary_muscle_group: "back", secondary_muscle_groups: %w[biceps], equipment: "cable", category: "compound",
    description: "Puxada na polia alta com pegada aberta, em direção ao peito." },
  { name: "Barra Fixa", primary_muscle_group: "back", secondary_muscle_groups: %w[biceps core], equipment: "bodyweight", category: "compound",
    description: "Puxe o corpo até o queixo passar da barra." },
  { name: "Remada Baixa", primary_muscle_group: "back", secondary_muscle_groups: %w[biceps], equipment: "cable", category: "compound",
    description: "Remada sentada na polia baixa com triângulo." },
  { name: "Remada Unilateral", primary_muscle_group: "back", secondary_muscle_groups: %w[biceps core], equipment: "dumbbell", category: "compound",
    description: "Remada serrote com halter, um braço apoiado no banco." },

  # Pernas
  { name: "Agachamento Livre", primary_muscle_group: "legs", secondary_muscle_groups: %w[glutes core], equipment: "barbell", category: "compound",
    description: "Agachamento com barra nas costas até quebrar a paralela." },
  { name: "Leg Press", primary_muscle_group: "legs", secondary_muscle_groups: %w[glutes], equipment: "machine", category: "compound",
    description: "Empurre a plataforma com os pés na máquina de leg press." },
  { name: "Cadeira Extensora", primary_muscle_group: "legs", secondary_muscle_groups: [], equipment: "machine", category: "isolation",
    description: "Extensão de joelhos na máquina, isolando o quadríceps." },
  { name: "Mesa Flexora", primary_muscle_group: "legs", secondary_muscle_groups: [], equipment: "machine", category: "isolation",
    description: "Flexão de joelhos deitado, isolando os posteriores de coxa." },
  { name: "Afundo", primary_muscle_group: "legs", secondary_muscle_groups: %w[glutes core], equipment: "dumbbell", category: "compound",
    description: "Passada à frente com halteres, alternando as pernas." },
  { name: "Stiff", primary_muscle_group: "legs", secondary_muscle_groups: %w[glutes back], equipment: "barbell", category: "compound",
    description: "Levantamento romeno com pernas semi-estendidas, foco em posteriores." },
  { name: "Agachamento Búlgaro", primary_muscle_group: "legs", secondary_muscle_groups: %w[glutes core], equipment: "dumbbell", category: "compound",
    description: "Agachamento unilateral com o pé de trás elevado no banco." },

  # Ombros
  { name: "Desenvolvimento Militar", primary_muscle_group: "shoulders", secondary_muscle_groups: %w[triceps core], equipment: "barbell", category: "compound",
    description: "Empurre a barra acima da cabeça, em pé." },
  { name: "Desenvolvimento com Halteres", primary_muscle_group: "shoulders", secondary_muscle_groups: %w[triceps], equipment: "dumbbell", category: "compound",
    description: "Desenvolvimento sentado com halteres." },
  { name: "Elevação Lateral", primary_muscle_group: "shoulders", secondary_muscle_groups: [], equipment: "dumbbell", category: "isolation",
    description: "Eleve os halteres lateralmente até a altura dos ombros." },
  { name: "Elevação Frontal", primary_muscle_group: "shoulders", secondary_muscle_groups: [], equipment: "dumbbell", category: "isolation",
    description: "Eleve os halteres à frente até a altura dos ombros." },
  { name: "Face Pull", primary_muscle_group: "shoulders", secondary_muscle_groups: %w[back], equipment: "cable", category: "isolation",
    description: "Puxe a corda em direção ao rosto, foco no deltoide posterior." },
  { name: "Band Pull Apart", primary_muscle_group: "shoulders", secondary_muscle_groups: %w[back], equipment: "band", category: "isolation",
    description: "Abra o elástico à frente do corpo, trabalhando deltoide posterior." },

  # Bíceps
  { name: "Rosca Direta", primary_muscle_group: "biceps", secondary_muscle_groups: %w[forearms], equipment: "barbell", category: "isolation",
    description: "Flexão de cotovelos com barra, cotovelos fixos ao corpo." },
  { name: "Rosca Alternada", primary_muscle_group: "biceps", secondary_muscle_groups: %w[forearms], equipment: "dumbbell", category: "isolation",
    description: "Rosca com halteres alternando os braços, com supinação." },
  { name: "Rosca Martelo", primary_muscle_group: "biceps", secondary_muscle_groups: %w[forearms], equipment: "dumbbell", category: "isolation",
    description: "Rosca com pegada neutra, enfatiza braquial e antebraço." },
  { name: "Rosca Scott", primary_muscle_group: "biceps", secondary_muscle_groups: [], equipment: "machine", category: "isolation",
    description: "Rosca no banco Scott, elimina o balanço do corpo." },

  # Tríceps
  { name: "Tríceps na Polia", primary_muscle_group: "triceps", secondary_muscle_groups: [], equipment: "cable", category: "isolation",
    description: "Extensão de cotovelos na polia alta com barra ou corda." },
  { name: "Tríceps Testa", primary_muscle_group: "triceps", secondary_muscle_groups: [], equipment: "barbell", category: "isolation",
    description: "Deitado, desça a barra até a testa e estenda os cotovelos." },
  { name: "Mergulho", primary_muscle_group: "triceps", secondary_muscle_groups: %w[chest shoulders], equipment: "bodyweight", category: "compound",
    description: "Dips nas paralelas, descendo até 90° de flexão de cotovelo." },

  # Core
  { name: "Prancha", primary_muscle_group: "core", secondary_muscle_groups: %w[shoulders glutes], equipment: "bodyweight", category: "isolation",
    description: "Isometria em prancha, mantendo o corpo alinhado." },
  { name: "Abdominal Crunch", primary_muscle_group: "core", secondary_muscle_groups: [], equipment: "bodyweight", category: "isolation",
    description: "Flexão de tronco no solo, encurtando o reto abdominal." },

  # Glúteos
  { name: "Hip Thrust", primary_muscle_group: "glutes", secondary_muscle_groups: %w[legs core], equipment: "barbell", category: "compound",
    description: "Elevação de quadril com barra, costas apoiadas no banco." },
  { name: "Kettlebell Swing", primary_muscle_group: "glutes", secondary_muscle_groups: %w[legs back core], equipment: "kettlebell", category: "compound",
    description: "Balanço explosivo do kettlebell impulsionado pelo quadril." },

  # Panturrilhas
  { name: "Panturrilha em Pé", primary_muscle_group: "calves", secondary_muscle_groups: [], equipment: "machine", category: "isolation",
    description: "Elevação de calcanhares em pé na máquina." },
  { name: "Panturrilha Sentado", primary_muscle_group: "calves", secondary_muscle_groups: [], equipment: "machine", category: "isolation",
    description: "Elevação de calcanhares sentado, foco no sóleo." },

  # Antebraços
  { name: "Rosca de Punho", primary_muscle_group: "forearms", secondary_muscle_groups: [], equipment: "barbell", category: "isolation",
    description: "Flexão de punhos com barra, antebraços apoiados no banco." }
].freeze

EXERCISES.each do |attrs|
  exercise = Exercise.find_or_initialize_by(name: attrs[:name])
  exercise.update!(attrs)
end

admin = User.find_or_initialize_by(email: ENV.fetch("ADMIN_EMAIL", "admin@liftthatsh.com"))
if admin.new_record?
  admin.name = "Admin"
  admin.password = ENV.fetch("ADMIN_PASSWORD", "admin123")
  admin.admin = true
  admin.save!
  puts "Seeds: usuário admin criado (#{admin.email})."
end

puts "Seeds: #{Exercise.count} exercícios no catálogo."
