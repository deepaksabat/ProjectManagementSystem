class Users::RegistrationsController < Devise::RegistrationsController

  def new
    super
  end

  def edit
    if current_user.admin?
      if params[:format]
        @user = User.find_by(id: params[:format].to_i)
      else
       @user = current_user
      end
    end
    render :edit
  end

  def update
    binding.pry
    self.resource = resource_class.to_adapter.get!(send(:"current_#{resource_name}").to_key)
    prev_unconfirmed_email = resource.unconfirmed_email if resource.respond_to?(:unconfirmed_email)

    resource_updated = update_resource(resource, account_update_params)
    yield resource if block_given?
    if resource_updated
      if is_flashing_format?
        flash_key = update_needs_confirmation?(resource, prev_unconfirmed_email) ?
          :update_needs_confirmation : :updated
        set_flash_message :notice, flash_key
      end
      bypass_sign_in resource, scope: resource_name
      respond_with resource, location: after_update_path_for(resource)
    else
      clean_up_passwords resource
      respond_with resource
    end
  end

  protected
  # Overwrite update_resource to let users to update their user without giving their password
  def update_resource(resource, params)
    resource.update_without_password(params)
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:account_update, keys: [:role, :name, :avatar])
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
  end

end
