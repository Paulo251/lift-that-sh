class MigrateUsersToDevise < ActiveRecord::Migration[8.0]
  def up
    # Hashes do has_secure_password são BCrypt, compatíveis com o Devise
    rename_column :users, :password_digest, :encrypted_password

    add_column :users, :jti, :string
    execute "UPDATE users SET jti = gen_random_uuid()"
    change_column_null :users, :jti, false
    add_index :users, :jti, unique: true

    add_column :users, :admin, :boolean, null: false, default: false
  end

  def down
    remove_column :users, :admin
    remove_index :users, :jti
    remove_column :users, :jti
    rename_column :users, :encrypted_password, :password_digest
  end
end
