ActiveAdmin.register User do
permit_params :role
  actions :all, except: [:destroy]

  form do |f|
    inputs 'User' do
      f.input :role
    end
    f.semantic_errors
    f.actions
  end

end
