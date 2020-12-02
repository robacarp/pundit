crystal_doc_search_index_callback({"repository_name":"pundit","body":"# Pundit\n\n![Shard CI](https://github.com/stephendolan/pundit/workflows/Shard%20CI/badge.svg)\n[![API Documentation Website](https://img.shields.io/website?down_color=red&down_message=Offline&label=API%20Documentation&up_message=Online&url=https%3A%2F%2Fstephendolan.github.io%2Fpundit%2F)](https://stephendolan.github.io/pundit)\n[![GitHub release](https://img.shields.io/github/release/stephendolan/pundit.svg?label=Release)](https://github.com/stephendolan/pundit/releases)\n\nA simple Crystal shard for managing authorization in [Lucky](https://luckyframework.org) applications. Intended to mimic the excellent Ruby [Pundit](https://github.com/varvet/pundit) gem.\n\n**This library should not be used in production, as it is still actively undergoing API changes and is largely untested**\n\n## Lucky Installation\n\n1. Add the dependency to your `shard.yml`:\n\n   ```yaml\n   # shard.yml\n   dependencies:\n     pundit:\n       github: stephendolan/pundit\n   ```\n\n1. Run `shards install`\n\n1. Require the shard in your Lucky application\n\n   ```crystal\n   # shards.cr\n   require \"pundit\"\n   ```\n\n1. Require a new directory for policy definitions\n\n   ```crystal\n   # app.cr\n   require \"./policies/**\"\n   ```\n\n1. Include the `Pundit::ActionHelpers` module in `BrowserAction`:\n\n   ```crystal\n   # src/actions/browser_action.cr\n   include Pundit::ActionHelpers(User)\n   ```\n\n## Usage\n\n### Creating policies\n\nYour policies must inherit from the provided [`ApplicationPolicy(T)`](src/pundit/application_policy.cr) abstract class, where `T` is the model you are authorizing against.\n\nFor example, a `BookPolicy` may look like this:\n\n```crystal\nclass BookPolicy < ApplicationPolicy(Book)\n  def index?\n    true\n  end\nend\n```\n\nThe following methods are provided in [`ApplicationPolicy`](src/pundit/application_policy.cr):\n\n| Method Name | Default Value |\n| ----------- | ------------- |\n| `index?`    | `false`       |\n| `show?`     | `false`       |\n| `create?`   | `false`       |\n| `new?`      | `create?`     |\n| `update?`   | `false`       |\n| `edit?`     | `update?`     |\n| `delete?`   | `false`       |\n\n### Authorizing actions\n\nLet's say we have a `Books::Index` action that looks like this:\n\n```crystal\nclass Books::Index < BrowserAction\n  get \"/books/index\" do\n    html IndexPage, books: BookQuery.new\n  end\nend\n```\n\nTo use Pundit for authorization, simply add an `authorize` call:\n\n```crystal\nclass Books::Index < BrowserAction\n  get \"/books/index\" do\n    authorize\n\n    html IndexPage, books: BookQuery.new\n  end\nend\n```\n\nBehind the scenes, this is using the action's class name to check whether the `BookPolicy`'s `index?` method is permitted for `current_user`. If the call fails, a `Pundit::NotAuthorizedError` is raised.\n\nThe `authorize` call above is identical to writing this:\n\n```crystal\nBookPolicy.new(current_user).index? || raise Pundit::NotAuthorizedError.new\n```\n\nYou can also leverage specific records in your authorization. For example, say we have a `Books::Update` action that looks like this:\n\n```crystal\npost \"/books/:book_id/update\" do\n  book = BookQuery.find(book_id)\n\n  SaveBook.update(book, params) do |operation, book|\n    redirect Home::Index\n  end\nend\n```\n\nWe can add an `authorize` call to check whether or not the user is permitted to update this specific book like this:\n\n```crystal\npost \"/books/:book_id/update\" do\n  book = BookQuery.find(book_id)\n\n  authorize(book)\n\n  SaveBook.update(book, params) do |operation, book|\n    redirect Home::Index\n  end\nend\n```\n\n### Authorizing views\n\nSay we have a button to create a new book:\n\n```crystal\ndef render\n  button \"Create new book\"\nend\n```\n\nTo ensure that the `current_user` is permitted to create a new book before showing the button, we can wrap the button in a policy check:\n\n```crystal\ndef render\n  if BookPolicy.new(current_user).create?\n    button \"Create new book\"\n  end\nend\n```\n\n### Overriding defaults\n\nTODO: Need to document a Lucky task or something to generate the default ApplicationPolicy, and explain how to override\n\n### Handling authorization errors\n\nIf a call to `authorize` fails, a `Pundit::NotAuthorizedError` will be raised.\n\nYou can handle this elegantly by adding an overloaded `render` method to your `src/actions/errors/show.cr` action:\n\n```crystal\n# This class handles error responses and reporting.\n#\n# https://luckyframework.org/guides/http-and-routing/error-handling\nclass Errors::Show < Lucky::ErrorAction\n  DEFAULT_MESSAGE = \"Something went wrong.\"\n  default_format :html\n\n  # Capture Pundit authorization exceptions to handle it elegantly\n  def render(error : Pundit::NotAuthorizedError)\n    if html?\n      # We might want to throw an appropriate status and message\n      error_html \"Sorry, you're not authorized to access that\", status: 401\n\n      # Or maybe we just redirect users back to the previous page\n      # redirect_back fallback: Home::Index\n    else\n      error_json \"Not authorized\", status: 401\n    end\n  end\nend\n```\n\n## Contributing\n\n1. Fork it (<https://github.com/stephendolan/pundit/fork>)\n2. Create your feature branch (`git checkout -b my-new-feature`)\n3. Commit your changes (`git commit -am 'Add some feature'`)\n4. Push to the branch (`git push origin my-new-feature`)\n5. Create a new Pull Request\n\n## Contributors\n\n- [Stephen Dolan](https://github.com/stephendolan) - creator and maintainer\n\n## Inspiration\n\n- The [Pundit](https://github.com/varvet/pundit) Ruby gem was what formed my need as a programmer for this kind of simple approach to authorization\n- The [Praetorian](https://github.com/ilanusse/praetorian) Crystal shard took an excellent first step towards proving out the Pundit model in Crystal\n","program":{"html_id":"pundit/toplevel","path":"toplevel.html","kind":"module","full_name":"Top Level Namespace","name":"Top Level Namespace","abstract":false,"superclass":null,"ancestors":[],"locations":[],"repository_name":"pundit","program":true,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":null,"doc":null,"summary":null,"class_methods":[],"constructors":[],"instance_methods":[],"macros":[],"types":[{"html_id":"pundit/ApplicationPolicy","path":"ApplicationPolicy.html","kind":"class","full_name":"ApplicationPolicy(T)","name":"ApplicationPolicy","abstract":true,"superclass":{"html_id":"pundit/Reference","kind":"class","full_name":"Reference","name":"Reference"},"ancestors":[{"html_id":"pundit/Reference","kind":"class","full_name":"Reference","name":"Reference"},{"html_id":"pundit/Object","kind":"class","full_name":"Object","name":"Object"}],"locations":[{"filename":"src/pundit/application_policy.cr","line_number":1,"url":"https://github.com/stephendolan/pundit/blob/b737b22d09012bcce06c256848a6cdae0f1a4a27/src/pundit/application_policy.cr#L1"}],"repository_name":"pundit","program":false,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":null,"doc":null,"summary":null,"class_methods":[],"constructors":[{"id":"new(user:User?,record:T?=nil)-class-method","html_id":"new(user:User?,record:T?=nil)-class-method","name":"new","doc":null,"summary":null,"abstract":false,"args":[{"name":"user","doc":null,"default_value":"","external_name":"user","restriction":"User | ::Nil"},{"name":"record","doc":null,"default_value":"nil","external_name":"record","restriction":"T | ::Nil"}],"args_string":"(user : User?, record : T? = <span class=\"n\">nil</span>)","source_link":"https://github.com/stephendolan/pundit/blob/b737b22d09012bcce06c256848a6cdae0f1a4a27/src/pundit/application_policy.cr#L5","def":{"name":"new","args":[{"name":"user","doc":null,"default_value":"","external_name":"user","restriction":"User | ::Nil"},{"name":"record","doc":null,"default_value":"nil","external_name":"record","restriction":"T | ::Nil"}],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"_ = ApplicationPolicy(T).allocate\n_.initialize(user, record)\nif _.responds_to?(:finalize)\n  ::GC.add_finalizer(_)\nend\n_\n"}}],"instance_methods":[{"id":"create?-instance-method","html_id":"create?-instance-method","name":"create?","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"","source_link":"https://github.com/stephendolan/pundit/blob/b737b22d09012bcce06c256848a6cdae0f1a4a27/src/pundit/application_policy.cr#L16","def":{"name":"create?","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"false"}},{"id":"delete?-instance-method","html_id":"delete?-instance-method","name":"delete?","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"","source_link":"https://github.com/stephendolan/pundit/blob/b737b22d09012bcce06c256848a6cdae0f1a4a27/src/pundit/application_policy.cr#L32","def":{"name":"delete?","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"false"}},{"id":"edit?-instance-method","html_id":"edit?-instance-method","name":"edit?","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"","source_link":"https://github.com/stephendolan/pundit/blob/b737b22d09012bcce06c256848a6cdae0f1a4a27/src/pundit/application_policy.cr#L28","def":{"name":"edit?","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"update?"}},{"id":"index?-instance-method","html_id":"index?-instance-method","name":"index?","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"","source_link":"https://github.com/stephendolan/pundit/blob/b737b22d09012bcce06c256848a6cdae0f1a4a27/src/pundit/application_policy.cr#L8","def":{"name":"index?","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"false"}},{"id":"new?-instance-method","html_id":"new?-instance-method","name":"new?","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"","source_link":"https://github.com/stephendolan/pundit/blob/b737b22d09012bcce06c256848a6cdae0f1a4a27/src/pundit/application_policy.cr#L20","def":{"name":"new?","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"create?"}},{"id":"record-instance-method","html_id":"record-instance-method","name":"record","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"","source_link":"https://github.com/stephendolan/pundit/blob/b737b22d09012bcce06c256848a6cdae0f1a4a27/src/pundit/application_policy.cr#L3","def":{"name":"record","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"@record"}},{"id":"show?-instance-method","html_id":"show?-instance-method","name":"show?","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"","source_link":"https://github.com/stephendolan/pundit/blob/b737b22d09012bcce06c256848a6cdae0f1a4a27/src/pundit/application_policy.cr#L12","def":{"name":"show?","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"false"}},{"id":"update?-instance-method","html_id":"update?-instance-method","name":"update?","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"","source_link":"https://github.com/stephendolan/pundit/blob/b737b22d09012bcce06c256848a6cdae0f1a4a27/src/pundit/application_policy.cr#L24","def":{"name":"update?","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"false"}},{"id":"user-instance-method","html_id":"user-instance-method","name":"user","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"","source_link":"https://github.com/stephendolan/pundit/blob/b737b22d09012bcce06c256848a6cdae0f1a4a27/src/pundit/application_policy.cr#L2","def":{"name":"user","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"@user"}}],"macros":[],"types":[]},{"html_id":"pundit/Pundit","path":"Pundit.html","kind":"module","full_name":"Pundit","name":"Pundit","abstract":false,"superclass":null,"ancestors":[],"locations":[{"filename":"src/pundit.cr","line_number":4,"url":"https://github.com/stephendolan/pundit/blob/b737b22d09012bcce06c256848a6cdae0f1a4a27/src/pundit.cr#L4"},{"filename":"src/pundit/action_helpers.cr","line_number":1,"url":"https://github.com/stephendolan/pundit/blob/b737b22d09012bcce06c256848a6cdae0f1a4a27/src/pundit/action_helpers.cr#L1"},{"filename":"src/pundit/errors.cr","line_number":1,"url":"https://github.com/stephendolan/pundit/blob/b737b22d09012bcce06c256848a6cdae0f1a4a27/src/pundit/errors.cr#L1"},{"filename":"src/pundit/version.cr","line_number":1,"url":"https://github.com/stephendolan/pundit/blob/b737b22d09012bcce06c256848a6cdae0f1a4a27/src/pundit/version.cr#L1"}],"repository_name":"pundit","program":false,"enum":false,"alias":false,"aliased":"","const":false,"constants":[{"id":"VERSION","name":"VERSION","value":"\"0.3.0\"","doc":null,"summary":null}],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":null,"doc":"Module for handling authorization","summary":"<p>Module for handling authorization</p>","class_methods":[],"constructors":[],"instance_methods":[{"id":"do_something-instance-method","html_id":"do_something-instance-method","name":"do_something","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"","source_link":"https://github.com/stephendolan/pundit/blob/b737b22d09012bcce06c256848a6cdae0f1a4a27/src/pundit/version.cr#L4","def":{"name":"do_something","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"puts(\"Doing something!\")"}}],"macros":[],"types":[{"html_id":"pundit/Pundit/ActionHelpers","path":"Pundit/ActionHelpers.html","kind":"module","full_name":"Pundit::ActionHelpers(T)","name":"ActionHelpers","abstract":false,"superclass":null,"ancestors":[],"locations":[{"filename":"src/pundit/action_helpers.cr","line_number":1,"url":"https://github.com/stephendolan/pundit/blob/b737b22d09012bcce06c256848a6cdae0f1a4a27/src/pundit/action_helpers.cr#L1"}],"repository_name":"pundit","program":false,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":{"html_id":"pundit/Pundit","kind":"module","full_name":"Pundit","name":"Pundit"},"doc":null,"summary":null,"class_methods":[],"constructors":[],"instance_methods":[{"id":"current_user:T?-instance-method","html_id":"current_user:T?-instance-method","name":"current_user","doc":"We need to leverage the `current_user` method for implicit authorization checks","summary":"<p>We need to leverage the <code><a href=\"../Pundit/ActionHelpers.html#current_user:T?-instance-method\">#current_user</a></code> method for implicit authorization checks</p>","abstract":true,"args":[],"args_string":" : T?","source_link":"https://github.com/stephendolan/pundit/blob/b737b22d09012bcce06c256848a6cdae0f1a4a27/src/pundit/action_helpers.cr#L38","def":{"name":"current_user","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"T | ::Nil","visibility":"Public","body":""}}],"macros":[{"id":"authorize(object=nil,policy=nil,query=nil)-macro","html_id":"authorize(object=nil,policy=nil,query=nil)-macro","name":"authorize","doc":null,"summary":null,"abstract":false,"args":[{"name":"object","doc":null,"default_value":"nil","external_name":"object","restriction":""},{"name":"policy","doc":null,"default_value":"nil","external_name":"policy","restriction":""},{"name":"query","doc":null,"default_value":"nil","external_name":"query","restriction":""}],"args_string":"(object = <span class=\"n\">nil</span>, policy = <span class=\"n\">nil</span>, query = <span class=\"n\">nil</span>)","source_link":"https://github.com/stephendolan/pundit/blob/b737b22d09012bcce06c256848a6cdae0f1a4a27/src/pundit/action_helpers.cr#L2","def":{"name":"authorize","args":[{"name":"object","doc":null,"default_value":"nil","external_name":"object","restriction":""},{"name":"policy","doc":null,"default_value":"nil","external_name":"policy","restriction":""},{"name":"query","doc":null,"default_value":"nil","external_name":"query","restriction":""}],"double_splat":null,"splat_index":null,"block_arg":null,"visibility":"Public","body":"    \n# Split up the calling class to make it easier to work with\n\n    \n{% caller_class_array = @type.stringify.split(\"::\") %}\n\n\n    \n# First, get the plural base class.\n\n    \n# For `Store::Books::Index`, this yields `Store::Books`\n\n    \n{% caller_class_base_plural = caller_class_array[0..-2].join(\"::\") %}\n\n\n    \n# Next, singularize that base class.\n\n    \n# For `Store::Books`, this yields `Store::Book`\n\n    \n{% caller_class_base_singular = run(\"./run_macros/singularize.cr\", caller_class_base_plural) %}\n\n\n    \n# Finally, turn that base class into a policy.\n\n    \n# For `Store::Book`, this yields `Store::BookPolicy`\n\n    policy_class = \n{{ caller_class_base_singular.id }}\nPolicy\n\n    \n# Accept the override if a policy class has been manually provied\n\n    \n{% if policy %}\n      policy_class = {{ policy }}\n    {% end %}\n\n\n    \n# Pluck the action from the calling class and turn it into a policy method.\n\n    \n# For `Store::Books::Index`, this yields `index?`\n\n    \n{% method_name = (caller_class_array.last.underscore + \"?\").id %}\n\n\n    \n# Accept the override if a policy method has been manually provied\n\n    \n{% if query %}\n      {% method_name = query.id %}\n    {% end %}\n\n\n    \n# Finally, call the policy method.\n\n    \n# For `authorize` within `Store::Books::Index`, this calls `Store::BookPolicy.new(current_user, nil).index?`\n\n    policy_class.new(current_user, \n{{ object }}\n).\n{{ method_name }}\n || raise Pundit::NotAuthorizedError.new\n  \n"}}],"types":[]},{"html_id":"pundit/Pundit/Error","path":"Pundit/Error.html","kind":"class","full_name":"Pundit::Error","name":"Error","abstract":false,"superclass":{"html_id":"pundit/Exception","kind":"class","full_name":"Exception","name":"Exception"},"ancestors":[{"html_id":"pundit/Exception","kind":"class","full_name":"Exception","name":"Exception"},{"html_id":"pundit/Reference","kind":"class","full_name":"Reference","name":"Reference"},{"html_id":"pundit/Object","kind":"class","full_name":"Object","name":"Object"}],"locations":[{"filename":"src/pundit/errors.cr","line_number":2,"url":"https://github.com/stephendolan/pundit/blob/b737b22d09012bcce06c256848a6cdae0f1a4a27/src/pundit/errors.cr#L2"}],"repository_name":"pundit","program":false,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[{"html_id":"pundit/Pundit/NotAuthorizedError","kind":"class","full_name":"Pundit::NotAuthorizedError","name":"NotAuthorizedError"}],"including_types":[],"namespace":{"html_id":"pundit/Pundit","kind":"module","full_name":"Pundit","name":"Pundit"},"doc":null,"summary":null,"class_methods":[],"constructors":[],"instance_methods":[],"macros":[],"types":[]},{"html_id":"pundit/Pundit/NotAuthorizedError","path":"Pundit/NotAuthorizedError.html","kind":"class","full_name":"Pundit::NotAuthorizedError","name":"NotAuthorizedError","abstract":false,"superclass":{"html_id":"pundit/Pundit/Error","kind":"class","full_name":"Pundit::Error","name":"Error"},"ancestors":[{"html_id":"pundit/Pundit/Error","kind":"class","full_name":"Pundit::Error","name":"Error"},{"html_id":"pundit/Exception","kind":"class","full_name":"Exception","name":"Exception"},{"html_id":"pundit/Reference","kind":"class","full_name":"Reference","name":"Reference"},{"html_id":"pundit/Object","kind":"class","full_name":"Object","name":"Object"}],"locations":[{"filename":"src/pundit/errors.cr","line_number":5,"url":"https://github.com/stephendolan/pundit/blob/b737b22d09012bcce06c256848a6cdae0f1a4a27/src/pundit/errors.cr#L5"}],"repository_name":"pundit","program":false,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":{"html_id":"pundit/Pundit","kind":"module","full_name":"Pundit","name":"Pundit"},"doc":null,"summary":null,"class_methods":[],"constructors":[{"id":"new-class-method","html_id":"new-class-method","name":"new","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"","source_link":"https://github.com/stephendolan/pundit/blob/b737b22d09012bcce06c256848a6cdae0f1a4a27/src/pundit/errors.cr#L6","def":{"name":"new","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"_ = allocate\n_.initialize\nif _.responds_to?(:finalize)\n  ::GC.add_finalizer(_)\nend\n_\n"}}],"instance_methods":[],"macros":[],"types":[]}]}]}})